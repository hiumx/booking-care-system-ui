import React, { useState, useEffect, useMemo } from 'react';
import { RootState } from '../../../store';
import {
    fetchDiscounts,
    createDiscount,
    updateDiscount,
    deleteDiscount,
    clearError,
} from '../../../store/slices/discount.slice';
import {
    Discount,
    CreateDiscountRequest,
    UpdateDiscountRequest,
} from '../../../types/discount.types';
import { DiscountStatus, DiscountType, DiscountApplicableTo } from '../../../enums/discount.enums';
import styles from './DiscountManagement.module.scss';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';

interface DiscountFormData {
    code: string;
    name: string;
    description: string;
    clinicId: string;
    specialtyId: string;
    doctorId: string;
    applicableTo: DiscountApplicableTo;
    amount: number;
    discountType: DiscountType;
    startDate: string;
    endDate: string;
    maxUses: number | null;
}

const DiscountManagement: React.FC = () => {
    const dispatch = useAppDispatch();
    const { discounts, loading, error } = useAppSelector((state: RootState) => state.discount);

    const [showModal, setShowModal] = useState(false);
    const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<DiscountStatus | ''>('');
    const [typeFilter, setTypeFilter] = useState<DiscountType | ''>('');

    const [formData, setFormData] = useState<DiscountFormData>({
        code: '',
        name: '',
        description: '',
        clinicId: '',
        specialtyId: '',
        doctorId: '',
        applicableTo: DiscountApplicableTo.ALL,
        amount: 0,
        discountType: DiscountType.PERCENTAGE,
        startDate: '',
        endDate: '',
        maxUses: null,
    });

    // Load discounts on component mount
    useEffect(() => {
        dispatch(fetchDiscounts());
    }, [dispatch]);

    // Filter discounts based on search and filters
    const filteredDiscounts = useMemo(() => {
        return discounts.filter((discount) => {
            const matchesSearch =
                discount.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                discount.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = !statusFilter || discount.status === statusFilter;
            const matchesType = !typeFilter || discount.discountType === typeFilter;

            return matchesSearch && matchesStatus && matchesType;
        });
    }, [discounts, searchTerm, statusFilter, typeFilter]);

    const handleCreateNew = () => {
        setEditingDiscount(null);
        setFormData({
            code: '',
            name: '',
            description: '',
            clinicId: '',
            specialtyId: '',
            doctorId: '',
            applicableTo: DiscountApplicableTo.ALL,
            amount: 0,
            discountType: DiscountType.PERCENTAGE,
            startDate: '',
            endDate: '',
            maxUses: null,
        });
        setShowModal(true);
    };

    const handleEdit = (discount: Discount) => {
        setEditingDiscount(discount);
        setFormData({
            code: discount.code,
            name: discount.name,
            description: discount.description || '',
            clinicId: discount.clinicId,
            specialtyId: discount.specialtyId || '',
            doctorId: discount.doctorId || '',
            applicableTo: discount.applicableTo,
            amount: discount.amount,
            discountType: discount.discountType,
            startDate: discount.startDate.split('T')[0],
            endDate: discount.endDate.split('T')[0],
            maxUses: discount.maxUses,
        });
        setShowModal(true);
    };

    const handleDelete = async (discountId: string) => {
        if (window.confirm('Are you sure you want to delete this discount?')) {
            await dispatch(deleteDiscount(discountId));
            dispatch(fetchDiscounts());
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingDiscount) {
                console.log('EDITING DISCOUNT: ', editingDiscount.id);

                const updateData: UpdateDiscountRequest = {
                    id: editingDiscount.id,
                    ...formData,
                    specialtyId: formData.specialtyId || undefined,
                    doctorId: formData.doctorId || undefined,
                    maxUses: formData.maxUses || undefined,
                };
                await dispatch(updateDiscount(updateData));
            } else {
                const createData: CreateDiscountRequest = {
                    ...formData,
                    specialtyId: formData.specialtyId || undefined,
                    doctorId: formData.doctorId || undefined,
                    maxUses: formData.maxUses || undefined,
                };
                await dispatch(createDiscount(createData));
            }

            setShowModal(false);
            dispatch(fetchDiscounts());
        } catch (error) {
            console.error('Error saving discount:', error);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === 'number' || type === 'select-one'
                    ? value
                        ? parseFloat(value)
                        : 0
                    : value,
        }));
    };

    console.log(formData);

    const getStatusBadge = (status: DiscountStatus) => {
        const statusClasses = {
            [DiscountStatus.ACTIVE]: 'bg-success',
            [DiscountStatus.INACTIVE]: 'bg-secondary',
            [DiscountStatus.EXPIRED]: 'bg-danger',
        };

        return `badge ${statusClasses[status] || 'bg-secondary'}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatAmount = (amount: number, type: DiscountType) => {
        return type === DiscountType.PERCENTAGE ? `${amount}%` : `$${amount.toFixed(2)}`;
    };

    return (
        <div className={styles.discountManagement}>
            <div className="container-fluid">
                {/* Header */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center">
                            <h2 className="mb-0">Discount Management</h2>
                            <button
                                className="btn btn-primary"
                                onClick={handleCreateNew}
                                disabled={loading.create}
                            >
                                <i className="fas fa-plus me-2"></i>
                                Create New Discount
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="row mb-3">
                        <div className="col-12">
                            <div className="alert alert-danger alert-dismissible">
                                {error}
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => dispatch(clearError())}
                                ></button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="row mb-4">
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by code or name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as DiscountStatus | '')}
                        >
                            <option value="">All Statuses</option>
                            <option value={DiscountStatus.ACTIVE}>Active</option>
                            <option value={DiscountStatus.INACTIVE}>Inactive</option>
                            <option value={DiscountStatus.EXPIRED}>Expired</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value as DiscountType | '')}
                        >
                            <option value="">All Types</option>
                            <option value={DiscountType.PERCENTAGE}>Percentage</option>
                            <option value={DiscountType.FIXED_AMOUNT}>Fixed Amount</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <button
                            className="btn btn-outline-secondary w-100"
                            onClick={() => {
                                setSearchTerm('');
                                setStatusFilter('');
                                setTypeFilter('');
                            }}
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Discounts Table */}
                <div className="row">
                    <div className="col-12">
                        {loading.discounts ? (
                            <div className="text-center py-5">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-striped table-hover">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Code</th>
                                            <th>Name</th>
                                            <th>Type</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Valid Period</th>
                                            <th>Usage</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredDiscounts.map((discount) => (
                                            <tr key={discount.id}>
                                                <td>
                                                    <code className="text-primary">
                                                        {discount.code}
                                                    </code>
                                                </td>
                                                <td>{discount.name}</td>
                                                <td>
                                                    <span className="badge bg-info">
                                                        {discount.discountType ===
                                                        DiscountType.PERCENTAGE
                                                            ? 'Percentage'
                                                            : 'Fixed Amount'}
                                                    </span>
                                                </td>
                                                <td className="fw-bold">
                                                    {formatAmount(
                                                        discount.amount,
                                                        discount.discountType
                                                    )}
                                                </td>
                                                <td>
                                                    <span
                                                        className={getStatusBadge(discount.status)}
                                                    >
                                                        {discount.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="small">
                                                        <div>{formatDate(discount.startDate)}</div>
                                                        <div className="text-muted">
                                                            to {formatDate(discount.endDate)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="small">
                                                        <div>{discount.usesCount}</div>
                                                        <div className="text-muted">
                                                            {discount.maxUses
                                                                ? `of ${discount.maxUses}`
                                                                : 'unlimited'}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="btn-group btn-group-sm">
                                                        <button
                                                            className="btn btn-outline-primary"
                                                            onClick={() => handleEdit(discount)}
                                                            disabled={loading.update}
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger"
                                                            onClick={() =>
                                                                handleDelete(discount.id)
                                                            }
                                                            disabled={loading.delete}
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {filteredDiscounts.length === 0 && (
                                    <div className="text-center py-5 text-muted">
                                        <i className="fas fa-inbox fa-3x mb-3"></i>
                                        <h5>No discounts found</h5>
                                        <p>
                                            Try adjusting your search criteria or create a new
                                            discount.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal for Create/Edit */}
            {showModal && (
                <div
                    className="modal fade show d-block"
                    tabIndex={-1}
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingDiscount ? 'Edit Discount' : 'Create New Discount'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Code *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="code"
                                                value={formData.code}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="e.g., SAVE20"
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Name *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Discount name"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={3}
                                            placeholder="Discount description"
                                        />
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Discount Type *</label>
                                            <select
                                                className="form-select"
                                                name="discountType"
                                                value={formData.discountType}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value={DiscountType.PERCENTAGE}>
                                                    Percentage
                                                </option>
                                                <option value={DiscountType.FIXED_AMOUNT}>
                                                    Fixed Amount
                                                </option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">
                                                Amount *{' '}
                                                {formData.discountType === DiscountType.PERCENTAGE
                                                    ? '(%)'
                                                    : '($)'}
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="amount"
                                                value={formData.amount}
                                                onChange={handleInputChange}
                                                required
                                                min="0"
                                                max={
                                                    formData.discountType ===
                                                    DiscountType.PERCENTAGE
                                                        ? '100'
                                                        : undefined
                                                }
                                                step="0.01"
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Start Date *</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="startDate"
                                                value={formData.startDate}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">End Date *</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="endDate"
                                                value={formData.endDate}
                                                onChange={handleInputChange}
                                                required
                                                min={formData.startDate}
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Applicable To</label>
                                            <select
                                                className="form-select"
                                                name="applicableTo"
                                                value={formData.applicableTo}
                                                onChange={handleInputChange}
                                            >
                                                <option value={DiscountApplicableTo.ALL}>
                                                    All Services
                                                </option>
                                                <option value={DiscountApplicableTo.SPECIALTY}>
                                                    Specific Specialty
                                                </option>
                                                <option value={DiscountApplicableTo.DOCTOR}>
                                                    Specific Doctor
                                                </option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Max Uses</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="maxUses"
                                                value={formData.maxUses || ''}
                                                onChange={handleInputChange}
                                                min="1"
                                                placeholder="Leave empty for unlimited"
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Clinic ID *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="clinicId"
                                                value={formData.clinicId}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Clinic UUID"
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Specialty ID</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="specialtyId"
                                                value={formData.specialtyId}
                                                onChange={handleInputChange}
                                                placeholder="Specialty UUID (optional)"
                                                disabled={
                                                    formData.applicableTo !==
                                                    DiscountApplicableTo.SPECIALTY
                                                }
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Doctor ID</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="doctorId"
                                                value={formData.doctorId}
                                                onChange={handleInputChange}
                                                placeholder="Doctor UUID (optional)"
                                                disabled={
                                                    formData.applicableTo !==
                                                    DiscountApplicableTo.DOCTOR
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading.create || loading.update}
                                    >
                                        {loading.create || loading.update ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                ></span>
                                                Saving...
                                            </>
                                        ) : editingDiscount ? (
                                            'Update Discount'
                                        ) : (
                                            'Create Discount'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiscountManagement;
