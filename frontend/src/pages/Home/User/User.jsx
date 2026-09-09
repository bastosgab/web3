import { useEffect, useState } from 'react';
import { Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import {
    createUser,
    deleteUser,
    getUser,
    getUsers,
    updateUser,
} from '../../../services/userService';

const emptyForm = { name: '', email: '', pass: '' };

function Usuarios() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchId, setSearchId] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    const loadUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getUsers();
            setUsers(response.data || []);
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Erro ao buscar usuários');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleSearch = async (event) => {
        event.preventDefault();
        if (!searchId.trim()) return loadUsers();

        setLoading(true);
        setError('');
        try {
            const response = await getUser(searchId.trim());
            setUsers([response.data]);
        } catch (err) {
            setUsers([]);
            setError(err.response?.data?.error || 'Usuário não encontrado');
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingUser(null);
        setForm(emptyForm);
        setError('');
        setModalOpen(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setForm({ name: user.name, email: user.email, pass: '' });
        setError('');
        setModalOpen(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError('');
        try {
            const payload = { name: form.name, email: form.email };
            if (form.pass) payload.pass = form.pass;

            if (editingUser) {
                await updateUser(editingUser.id, payload);
            } else {
                await createUser({ ...payload, pass: form.pass });
            }

            setModalOpen(false);
            await loadUsers();
        } catch (err) {
            setError(err.response?.data?.error || 'Não foi possível salvar o usuário');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (user) => {
        if (!window.confirm(`Excluir o usuário ${user.name}?`)) return;

        setError('');
        try {
            await deleteUser(user.id);
            await loadUsers();
        } catch (err) {
            setError(err.response?.data?.error || 'Não foi possível excluir o usuário');
        }
    };

    return (
        <div className="page-container users-page">
            <div className="users-heading">
                <div>
                    <span className="eyebrow">Administração</span>
                    <h1>Usuários</h1>
                    <p>Gerencie os acessos cadastrados no sistema.</p>
                </div>
                <button type="button" className="primary-button" onClick={openCreateModal}>
                    <Plus size={18} /> Novo usuário
                </button>
            </div>

            <form className="user-search" onSubmit={handleSearch}>
                <Search size={19} aria-hidden="true" />
                <input
                    value={searchId}
                    onChange={(event) => setSearchId(event.target.value)}
                    inputMode="numeric"
                    placeholder="Buscar usuário por ID"
                    aria-label="Buscar usuário por ID"
                />
                <button type="submit" className="secondary-button">Buscar</button>
                {searchId && (
                    <button type="button" className="clear-button" onClick={() => { setSearchId(''); loadUsers(); }}>
                        Limpar
                    </button>
                )}
            </form>

            {error && <div className="feedback error-feedback">{error}</div>}
            {loading && <div className="feedback">Carregando usuários...</div>}
            {!loading && !error && users.length === 0 && (
                <div className="feedback">Nenhum usuário encontrado.</div>
            )}

            {!loading && users.length > 0 && (
                <div className="user-list">
                    {users.map((user) => (
                        <article className="user-card" key={user.id}>
                            <div className="user-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                            <div className="user-info">
                                <strong>{user.name}</strong>
                                <span>{user.email}</span>
                            </div>
                            <span className="user-id">ID #{user.id}</span>
                            <div className="user-actions">
                                <button type="button" className="icon-button" onClick={() => openEditModal(user)} title="Editar usuário" aria-label={`Editar ${user.name}`}>
                                    <Pencil size={17} />
                                </button>
                                <button type="button" className="icon-button danger" onClick={() => handleDelete(user)} title="Excluir usuário" aria-label={`Excluir ${user.name}`}>
                                    <Trash2 size={17} />
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {modalOpen && (
                <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setModalOpen(false)}>
                    <section className="user-modal" role="dialog" aria-modal="true" aria-labelledby="user-modal-title">
                        <div className="modal-header">
                            <div>
                                <span className="eyebrow">Cadastro</span>
                                <h2 id="user-modal-title">{editingUser ? 'Editar usuário' : 'Novo usuário'}</h2>
                            </div>
                            <button type="button" className="icon-button" onClick={() => setModalOpen(false)} aria-label="Fechar modal">
                                <X size={20} />
                            </button>
                        </div>
                        <form className="user-form" onSubmit={handleSubmit}>
                            <label>Nome<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
                            <label>E-mail<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
                            <label>Senha{editingUser && <small> deixe em branco para manter a atual</small>}<input required={!editingUser} minLength="6" type="password" value={form.pass} onChange={(event) => setForm({ ...form, pass: event.target.value })} /></label>
                            {error && <div className="form-error">{error}</div>}
                            <div className="modal-actions">
                                <button type="button" className="secondary-button" onClick={() => setModalOpen(false)}>Cancelar</button>
                                <button type="submit" className="primary-button" disabled={saving}>{saving ? 'Salvando...' : 'Salvar usuário'}</button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </div>
    );
}

export default Usuarios;