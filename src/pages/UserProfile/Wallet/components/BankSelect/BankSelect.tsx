import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

import { Bank } from '../../types/bank.types';
import BankService from '../../services/bank.service';
import styles from './BankSelect.module.scss';

interface BankSelectProps {
    value: string;
    onChange: (bankCode: string, bank?: Bank) => void;
    placeholder?: string;
    required?: boolean;
    id?: string;
    className?: string;
}

const BankSelect: React.FC<BankSelectProps> = ({
    value,
    onChange,
    placeholder = 'Chọn ngân hàng',
    required = false,
    id,
    className,
}) => {
    const [banks, setBanks] = useState<Bank[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const selectRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const selectedBank = banks.find((bank) => bank.code === value);

    useEffect(() => {
        loadBanks();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const loadBanks = async () => {
        setLoading(true);
        try {
            const bankData = await BankService.getBanks();
            setBanks(bankData);
        } catch (error) {
            console.error('Failed to load banks:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBanks = banks.filter(
        (bank) =>
            bank.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bank.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectBank = (bank: Bank) => {
        onChange(bank.code, bank);
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            // Focus search input when opening
            setTimeout(() => {
                searchRef.current?.focus();
            }, 100);
        }
    };

    const dropdownVariants = {
        initial: {
            opacity: 0,
            y: -10,
            scale: 0.95,
        },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: 'spring' as const,
                stiffness: 300,
                damping: 24,
            },
        },
        exit: {
            opacity: 0,
            y: -10,
            scale: 0.95,
            transition: {
                duration: 0.2,
            },
        },
    };

    const itemVariants = {
        initial: { opacity: 0, x: -10 },
        animate: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.02,
                duration: 0.2,
            },
        }),
    };

    return (
        <div ref={selectRef} className={clsx(styles.bankSelect, className)} id={id}>
            <motion.button
                type="button"
                className={clsx(styles.selectButton, {
                    [styles.open]: isOpen,
                    [styles.hasValue]: selectedBank,
                    [styles.required]: required && !selectedBank,
                })}
                onClick={handleToggle}
                whileTap={{ scale: 0.98 }}
                aria-required={required}
            >
                <div className={styles.selectedContent}>
                    {selectedBank ? (
                        <div className={styles.selectedBank}>
                            <img
                                src={selectedBank.logo}
                                alt={selectedBank.shortName}
                                className={styles.bankLogo}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/placeholder-bank.png';
                                }}
                            />
                            <div className={styles.bankInfo}>
                                <span className={styles.bankName}>{selectedBank.shortName}</span>
                                <span className={styles.bankCode}>{selectedBank.code}</span>
                            </div>
                        </div>
                    ) : (
                        <span className={styles.placeholder}>{placeholder}</span>
                    )}
                </div>

                <motion.div
                    className={styles.arrow}
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <i className="fa-solid fa-chevron-down"></i>
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.dropdown}
                        variants={dropdownVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <div className={styles.searchContainer}>
                            <input
                                ref={searchRef}
                                type="text"
                                placeholder="Tìm kiếm ngân hàng..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                            <i className="fa-solid fa-search"></i>
                        </div>

                        <div className={styles.bankList}>
                            {loading && (
                                <div className={styles.loading}>
                                    <div className={styles.spinner}></div>
                                    <span>Đang tải danh sách ngân hàng...</span>
                                </div>
                            )}

                            {!loading && filteredBanks.length === 0 && (
                                <div className={styles.noResults}>
                                    Không tìm thấy ngân hàng phù hợp
                                </div>
                            )}

                            {!loading &&
                                filteredBanks.length > 0 &&
                                filteredBanks.map((bank, index) => (
                                    <motion.button
                                        key={bank.code}
                                        type="button"
                                        className={clsx(styles.bankItem, {
                                            [styles.selected]: bank.code === value,
                                        })}
                                        onClick={() => handleSelectBank(bank)}
                                        variants={itemVariants}
                                        initial="initial"
                                        animate="animate"
                                        custom={index}
                                        whileHover={{
                                            backgroundColor: '#f3f4f6',
                                            x: 2,
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <img
                                            src={bank.logo}
                                            alt={bank.shortName}
                                            className={styles.bankLogo}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src =
                                                    '/placeholder-bank.png';
                                            }}
                                        />
                                        <div className={styles.bankInfo}>
                                            <span className={styles.bankName}>
                                                {bank.shortName}
                                            </span>
                                            <span className={styles.bankFullName}>{bank.name}</span>
                                        </div>
                                        {bank.code === value && (
                                            <i className="fa-solid fa-check text-primary"></i>
                                        )}
                                    </motion.button>
                                ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BankSelect;
