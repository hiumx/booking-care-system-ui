import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { validateDiscountCode, clearValidationResult } from '../../../store/slices/discount.slice';
import { RootState } from '../../../store';

/**
 * DiscountValidationDemo - Example component showing how to integrate
 * discount validation in booking or checkout flows
 */
const DiscountValidationDemo: React.FC = () => {
    const dispatch = useAppDispatch();
    const { validationResult, loading } = useAppSelector((state: RootState) => state.discount);

    const [discountCode, setDiscountCode] = useState('');
    const [bookingContext] = useState({
        clinicId: 1,
        specialtyId: 1,
        doctorId: 1,
        amount: 100,
    });

    const handleValidateDiscount = async () => {
        if (!discountCode.trim()) return;

        try {
            await dispatch(
                validateDiscountCode({
                    code: discountCode,
                    context: bookingContext,
                })
            ).unwrap();
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handleClearValidation = () => {
        dispatch(clearValidationResult());
        setDiscountCode('');
    };

    const calculateDiscountedAmount = () => {
        if (!validationResult?.isValid || !validationResult.discount) {
            return bookingContext.amount;
        }

        const discount = validationResult.discount;
        if (discount.discountType === 'PERCENTAGE') {
            return bookingContext.amount * (1 - discount.amount / 100);
        } else {
            return Math.max(0, bookingContext.amount - discount.amount);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="mb-0">Discount Validation Demo</h4>
                            <small className="text-muted">
                                Example integration of discount validation in booking flow
                            </small>
                        </div>
                        <div className="card-body">
                            {/* Booking Summary */}
                            <div className="mb-4">
                                <h6>Booking Summary</h6>
                                <div className="bg-light p-3 rounded">
                                    <div className="d-flex justify-content-between">
                                        <span>Clinic ID:</span>
                                        <span>{bookingContext.clinicId}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>Specialty ID:</span>
                                        <span>{bookingContext.specialtyId}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>Doctor ID:</span>
                                        <span>{bookingContext.doctorId}</span>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between fw-bold">
                                        <span>Original Amount:</span>
                                        <span>${bookingContext.amount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Discount Code Input */}
                            <div className="mb-3">
                                <label className="form-label">Discount Code</label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter discount code"
                                        value={discountCode}
                                        onChange={(e) =>
                                            setDiscountCode(e.target.value.toUpperCase())
                                        }
                                        disabled={loading.validation}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleValidateDiscount}
                                        disabled={!discountCode.trim() || loading.validation}
                                    >
                                        {loading.validation ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Validating...
                                            </>
                                        ) : (
                                            'Apply'
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Validation Result */}
                            {validationResult && (
                                <div className="mb-3">
                                    {validationResult.isValid ? (
                                        <div className="alert alert-success">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <strong>✅ Discount Applied!</strong>
                                                    <br />
                                                    <small>{validationResult.discount?.name}</small>
                                                </div>
                                                <button
                                                    className="btn btn-sm btn-outline-success"
                                                    onClick={handleClearValidation}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="alert alert-danger">
                                            <strong>❌ Invalid Discount Code</strong>
                                            <br />
                                            <small>{validationResult.message}</small>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Final Amount */}
                            <div className="bg-primary text-white p-3 rounded">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="mb-0 text-white">Total Amount</h6>
                                        {validationResult?.isValid && (
                                            <small className="text-light">
                                                Discount:{' '}
                                                {validationResult.discount?.discountType ===
                                                'PERCENTAGE'
                                                    ? `${validationResult.discount.amount}%`
                                                    : `$${validationResult.discount?.amount}`}
                                            </small>
                                        )}
                                    </div>
                                    <h4 className="mb-0 text-white">
                                        ${calculateDiscountedAmount().toFixed(2)}
                                    </h4>
                                </div>
                                {validationResult?.isValid && (
                                    <div className="mt-2">
                                        <small className="text-light">
                                            You saved: $
                                            {(
                                                bookingContext.amount - calculateDiscountedAmount()
                                            ).toFixed(2)}
                                        </small>
                                    </div>
                                )}
                            </div>

                            {/* Usage Information */}
                            {validationResult?.isValid && validationResult.discount && (
                                <div className="mt-3">
                                    <small className="text-muted">
                                        <strong>Discount Details:</strong>
                                        <br />
                                        Code: {validationResult.discount.code}
                                        <br />
                                        Valid until:{' '}
                                        {new Date(
                                            validationResult.discount.endDate
                                        ).toLocaleDateString()}
                                        <br />
                                        {validationResult.discount.maxUses && (
                                            <>
                                                Uses: {validationResult.discount.usesCount} /{' '}
                                                {validationResult.discount.maxUses}
                                            </>
                                        )}
                                    </small>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Code Example */}
            <div className="row justify-content-center mt-4">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h6 className="mb-0">Implementation Example</h6>
                        </div>
                        <div className="card-body">
                            <pre className="bg-light p-3 rounded">
                                <code>{`// Example usage in your component
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { validateDiscountCode } from '../store/slices/discount.slice';

const MyBookingComponent = () => {
    const dispatch = useAppDispatch();
    const { validationResult, loading } = useAppSelector(state => state.discount);
    
    const handleApplyDiscount = async (code: string) => {
        await dispatch(validateDiscountCode({
            code,
            context: {
                clinicId: 1,
                specialtyId: 1,
                doctorId: 1,
                amount: 100
            }
        }));
    };
    
    return (
        <div>
            {/* Your component JSX */}
        </div>
    );
};`}</code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiscountValidationDemo;
