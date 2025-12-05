"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    CreditCard,
    Filter,
    Download,
    Search,
    ChevronLeft,
    ChevronRight,
    Calendar,
    DollarSign,
    CheckCircle,
    XCircle,
    Clock,
    ArrowUpRight
} from "lucide-react";

export default function AdminPayments() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState([]);
    const [summary, setSummary] = useState({ totalAmount: 0, count: 0 });
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

    // Filters
    const [filters, setFilters] = useState({
        status: "all",
        period: "total",
        minAmount: "",
        maxAmount: "",
    });

    useEffect(() => {
        fetchPayments();
    }, [filters, pagination.page]);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                router.push("/admin/login");
                return;
            }

            const queryParams = new URLSearchParams({
                page: pagination.page,
                limit: 10,
                status: filters.status,
                period: filters.period,
                ...(filters.minAmount && { minAmount: filters.minAmount }),
                ...(filters.maxAmount && { maxAmount: filters.maxAmount }),
            });

            const response = await fetch(`/api/admin/payments?${queryParams}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 401) {
                localStorage.removeItem("adminToken");
                router.push("/admin/login");
                return;
            }

            const data = await response.json();
            if (data.success) {
                setPayments(data.data);
                setSummary(data.summary);
                setPagination(prev => ({ ...prev, ...data.pagination }));
            }
        } catch (error) {
            console.error("Failed to fetch payments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 on filter change
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'payment_success': return 'bg-green-100 text-green-700';
            case 'payment_failed': return 'bg-red-100 text-red-700';
            default: return 'bg-amber-100 text-amber-700';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'payment_success': return <CheckCircle className="w-3 h-3" />;
            case 'payment_failed': return <XCircle className="w-3 h-3" />;
            default: return <Clock className="w-3 h-3" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Collected</p>
                        <h3 className="text-2xl font-bold text-[#022741]">{formatCurrency(summary.totalAmount)}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
                        <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Transactions</p>
                        <h3 className="text-2xl font-bold text-[#022741]">{summary.count}</h3>
                    </div>
                </div>

                {/* Placeholder for future stat */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Current Period</p>
                        <h3 className="text-xl font-bold text-[#022741] capitalize">{filters.period}</h3>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4 w-full md:w-auto">

                    {/* Status Filter */}
                    <div className="relative">
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange("status", e.target.value)}
                            className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium cursor-pointer"
                        >
                            <option value="all">All Status</option>
                            <option value="payment_success">Success</option>
                            <option value="pending">Pending</option>
                            <option value="payment_failed">Failed</option>
                        </select>
                        <Filter className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* Period Filter */}
                    <div className="relative">
                        <select
                            value={filters.period}
                            onChange={(e) => handleFilterChange("period", e.target.value)}
                            className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium cursor-pointer"
                        >
                            <option value="total">All Time</option>
                            <option value="monthly">Last 30 Days</option>
                            <option value="weekly">Last 7 Days</option>
                            <option value="yearly">Last 365 Days</option>
                        </select>
                        <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* Amount Range */}
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="Min ₹"
                            value={filters.minAmount}
                            onChange={(e) => handleFilterChange("minAmount", e.target.value)}
                            className="w-24 bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <span className="text-gray-400">-</span>
                        <input
                            type="number"
                            placeholder="Max ₹"
                            value={filters.maxAmount}
                            onChange={(e) => handleFilterChange("maxAmount", e.target.value)}
                            className="w-24 bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Donor</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <p className="mt-2 text-gray-500 text-sm">Loading payments...</p>
                                    </td>
                                </tr>
                            ) : payments.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No payments found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                payments.map((payment) => (
                                    <tr key={payment._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{payment.donorName}</p>
                                                <p className="text-xs text-gray-500">{payment.donorEmail}</p>
                                                <p className="text-xs text-gray-400">{payment.donorPhone}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-[#022741]">{formatCurrency(payment.amount)}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(payment.createdAt).toLocaleDateString()}
                                            <br />
                                            <span className="text-xs text-gray-400">{new Date(payment.createdAt).toLocaleTimeString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                {payment.merchantOrderId}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(payment.status)}`}>
                                                {getStatusIcon(payment.status)}
                                                {payment.status.replace('payment_', '')}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && payments.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                        <p className="text-sm text-gray-500">
                            Showing page <span className="font-bold">{pagination.page}</span> of <span className="font-bold">{pagination.pages}</span>
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                                disabled={pagination.page === 1}
                                className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.pages, prev.page + 1) }))}
                                disabled={pagination.page === pagination.pages}
                                className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
