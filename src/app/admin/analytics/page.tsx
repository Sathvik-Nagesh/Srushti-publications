'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Users,
  Eye,
  ShoppingCart,
  IndianRupee,
  BarChart3,
  PieChart,
  ArrowLeft,
  FileSpreadsheet
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

// Mock analytics data
const mockSalesData = [
  { month: 'ಜನ', sales: 45000, orders: 23 },
  { month: 'ಫೆಬ್ರ', sales: 52000, orders: 28 },
  { month: 'ಮಾರ್ಚ್', sales: 48000, orders: 25 },
  { month: 'ಏಪ್ರಿ', sales: 61000, orders: 32 },
  { month: 'ಮೇ', sales: 55000, orders: 29 },
  { month: 'ಜೂನ್', sales: 67000, orders: 35 },
  { month: 'ಜುಲೈ', sales: 72000, orders: 38 },
  { month: 'ಆಗಸ್ಟ್', sales: 58000, orders: 31 },
  { month: 'ಸೆಪ್ಟೆ', sales: 63000, orders: 33 },
  { month: 'ಅಕ್ಟೋ', sales: 78000, orders: 41 },
  { month: 'ನವೆ', sales: 85000, orders: 45 },
  { month: 'ಡಿಸೆ', sales: 92000, orders: 48 }
]

const mockCategorySales = [
  { name: 'ಸಾಹಿತ್ಯ', sales: 125000, percentage: 35, color: '#3b82f6' },
  { name: 'ಶೈಕ್ಷಣಿಕ', sales: 98000, percentage: 28, color: '#8b5cf6' },
  { name: 'ಮಕ್ಕಳ ಪುಸ್ತಕಗಳು', sales: 72000, percentage: 20, color: '#ec4899' },
  { name: 'ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿ', sales: 45000, percentage: 12, color: '#10b981' },
  { name: 'ಇತರೆ', sales: 18000, percentage: 5, color: '#f59e0b' }
]

const mockVisitorStats = {
  totalVisitors: 15840,
  visitorChange: 18.5,
  pageViews: 45230,
  pageViewChange: 22.3,
  bounceRate: 32.5,
  avgSessionDuration: '4m 23s'
}

const mockOrders = [
  { id: '1', orderNumber: 'SP-2024-001', customerName: 'ರಾಜೇಶ್ ಕುಮಾರ್', email: 'rajesh@email.com', phone: '9876543210', items: 'ಮಲೆಗಳಲ್ಲಿ ಮದುಮಗಳು (1)', totalAmount: 399, status: 'DELIVERED', date: '2024-01-15' },
  { id: '2', orderNumber: 'SP-2024-002', customerName: 'ಪ್ರಿಯಾ ಶ್ರೀನಿವಾಸ್', email: 'priya@email.com', phone: '9876543211', items: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ (1)', totalAmount: 495, status: 'DISPATCHED', date: '2024-01-16' },
  { id: '3', orderNumber: 'SP-2024-003', customerName: 'ಮಹೇಶ್ ಗೌಡ', email: 'mahesh@email.com', phone: '9876543212', items: 'ಕೆಎಎಸ್ ಮಾರ್ಗದರ್ಶಿ (2)', totalAmount: 1398, status: 'PAID', date: '2024-01-17' },
  { id: '4', orderNumber: 'SP-2024-004', customerName: 'ಲಕ್ಷ್ಮಿ ದೇವಿ', email: 'lakshmi@email.com', phone: '9876543213', items: 'ಪಂಚತಂತ್ರ ಕಥೆಗಳು (3)', totalAmount: 447, status: 'DELIVERED', date: '2024-01-18' },
  { id: '5', orderNumber: 'SP-2024-005', customerName: 'ಸುರೇಶ್ ಶೆಟ್ಟಿ', email: 'suresh@email.com', phone: '9876543214', items: 'ಮಲೆಗಳಲ್ಲಿ ಮದುಮಗಳು (1), ಕರ್ನಾಟಕ ಇತಿಹಾಸ (1)', totalAmount: 894, status: 'PENDING', date: '2024-01-19' },
]

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('this_month')
  const [isExporting, setIsExporting] = useState(false)
  
  const maxSales = Math.max(...mockSalesData.map(d => d.sales))
  
  const handleExportCSV = () => {
    setIsExporting(true)
    
    // Create CSV content
    const headers = ['Order Number', 'Customer Name', 'Email', 'Phone', 'Items', 'Amount', 'Status', 'Date']
    const rows = mockOrders.map(order => [
      order.orderNumber,
      order.customerName,
      order.email,
      order.phone,
      order.items,
      order.totalAmount,
      order.status,
      order.date
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    // Create and download file
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    
    setTimeout(() => {
      setIsExporting(false)
      toast.success('ಆರ್ಡರ್‌ಗಳನ್ನು CSV ಆಗಿ ಎಕ್ಸ್ಪೋರ್ಟ್ ಮಾಡಲಾಗಿದೆ!')
    }, 500)
  }
  
  const handleExportExcel = () => {
    setIsExporting(true)
    
    // For Excel, we create an HTML table that Excel can open
    const table = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head><meta charset="UTF-8"></head>
      <body>
        <table border="1">
          <tr>
            <th>ಆರ್ಡರ್ ಸಂಖ್ಯೆ</th>
            <th>ಗ್ರಾಹಕರ ಹೆಸರು</th>
            <th>ಇಮೇಲ್</th>
            <th>ಫೋನ್</th>
            <th>ಐಟಂಗಳು</th>
            <th>ಮೊತ್ತ</th>
            <th>ಸ್ಥಿತಿ</th>
            <th>ದಿನಾಂಕ</th>
          </tr>
          ${mockOrders.map(order => `
            <tr>
              <td>${order.orderNumber}</td>
              <td>${order.customerName}</td>
              <td>${order.email}</td>
              <td>${order.phone}</td>
              <td>${order.items}</td>
              <td>₹${order.totalAmount}</td>
              <td>${order.status}</td>
              <td>${order.date}</td>
            </tr>
          `).join('')}
        </table>
      </body>
      </html>
    `
    
    const blob = new Blob([table], { type: 'application/vnd.ms-excel;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `orders_export_${new Date().toISOString().split('T')[0]}.xls`
    link.click()
    
    setTimeout(() => {
      setIsExporting(false)
      toast.success('ಆರ್ಡರ್‌ಗಳನ್ನು Excel ಆಗಿ ಎಕ್ಸ್ಪೋರ್ಟ್ ಮಾಡಲಾಗಿದೆ!')
    }, 500)
  }
  
  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <Link 
            href="/admin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-text-light)',
              textDecoration: 'none',
              marginBottom: '0.5rem',
              fontSize: '0.875rem'
            }}
          >
            <ArrowLeft size={16} />
            ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            <BarChart3 size={28} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
            ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ವರದಿಗಳು
          </h1>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input select"
            style={{ width: 'auto', padding: '0.5rem 2rem 0.5rem 1rem' }}
          >
            <option value="today">ಇಂದು</option>
            <option value="this_week">ಈ ವಾರ</option>
            <option value="this_month">ಈ ತಿಂಗಳು</option>
            <option value="this_year">ಈ ವರ್ಷ</option>
            <option value="all_time">ಎಲ್ಲಾ ಸಮಯ</option>
          </select>
        </div>
      </div>
      
      {/* Visitor Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              background: '#3b82f620',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={20} style={{ color: '#3b82f6' }} />
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: 'var(--color-success)',
              fontSize: '0.75rem',
              fontWeight: 500
            }}>
              <TrendingUp size={14} />
              +{mockVisitorStats.visitorChange}%
            </div>
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            {mockVisitorStats.totalVisitors.toLocaleString()}
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)', margin: 0 }}>
            ಒಟ್ಟು ಸಂದರ್ಶಕರು
          </p>
        </div>
        
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              background: '#8b5cf620',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Eye size={20} style={{ color: '#8b5cf6' }} />
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: 'var(--color-success)',
              fontSize: '0.75rem',
              fontWeight: 500
            }}>
              <TrendingUp size={14} />
              +{mockVisitorStats.pageViewChange}%
            </div>
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            {mockVisitorStats.pageViews.toLocaleString()}
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)', margin: 0 }}>
            ಪುಟ ವೀಕ್ಷಣೆಗಳು
          </p>
        </div>
        
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              background: '#f59e0b20',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingDown size={20} style={{ color: '#f59e0b' }} />
            </div>
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            {mockVisitorStats.bounceRate}%
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)', margin: 0 }}>
            ಬೌನ್ಸ್ ದರ
          </p>
        </div>
        
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              background: '#10b98120',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Calendar size={20} style={{ color: '#10b981' }} />
            </div>
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            {mockVisitorStats.avgSessionDuration}
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)', margin: 0 }}>
            ಸರಾಸರಿ ಅವಧಿ
          </p>
        </div>
      </div>
      
      {/* Sales Chart */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Bar Chart */}
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            <BarChart3 size={18} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
            ಮಾಸಿಕ ಮಾರಾಟ
          </h3>
          
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '0.5rem',
            height: 200,
            paddingBottom: '2rem'
          }}>
            {mockSalesData.map((data, index) => (
              <div
                key={index}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: `${(data.sales / maxSales) * 160}px`,
                    background: `linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)`,
                    borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                    transition: 'height 0.5s ease',
                    position: 'relative'
                  }}
                  title={`${data.month}: ${formatCurrency(data.sales)}`}
                >
                  <div style={{
                    position: 'absolute',
                    top: '-24px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    color: 'var(--color-text-light)',
                    whiteSpace: 'nowrap'
                  }}>
                    ₹{(data.sales / 1000).toFixed(0)}K
                  </div>
                </div>
                <span style={{
                  fontSize: '0.625rem',
                  color: 'var(--color-text-muted)'
                }}>
                  {data.month}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Category Pie Chart */}
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            <PieChart size={18} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
            ವಿಭಾಗವಾರು ಮಾರಾಟ
          </h3>
          
          {/* Simple bar representation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mockCategorySales.map((category, index) => (
              <div key={index}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    {category.name}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
                    {category.percentage}%
                  </span>
                </div>
                <div style={{
                  height: 8,
                  background: 'var(--color-bg-alt)',
                  borderRadius: 4,
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${category.percentage}%`,
                    height: '100%',
                    background: category.color,
                    borderRadius: 4,
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Export Section */}
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>
            <FileSpreadsheet size={18} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
            ಆರ್ಡರ್ ಎಕ್ಸ್ಪೋರ್ಟ್
          </h3>
          
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleExportCSV}
              disabled={isExporting}
              className="btn btn-outline"
              style={{ gap: '0.5rem' }}
            >
              <Download size={18} />
              CSV ಡೌನ್‌ಲೋಡ್
            </button>
            <button
              onClick={handleExportExcel}
              disabled={isExporting}
              className="btn btn-primary"
              style={{ gap: '0.5rem' }}
            >
              <FileSpreadsheet size={18} />
              Excel ಡೌನ್‌ಲೋಡ್
            </button>
          </div>
        </div>
        
        {/* Orders Preview Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>
                  ಆರ್ಡರ್ #
                </th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>
                  ಗ್ರಾಹಕ
                </th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>
                  ಐಟಂಗಳು
                </th>
                <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>
                  ಮೊತ್ತ
                </th>
                <th style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>
                  ಸ್ಥಿತಿ
                </th>
                <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>
                  ದಿನಾಂಕ
                </th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem 0.75rem', fontWeight: 500, color: 'var(--color-primary)' }}>
                    {order.orderNumber}
                  </td>
                  <td style={{ padding: '1rem 0.75rem' }}>
                    <div>
                      <p style={{ fontWeight: 500, marginBottom: '0.125rem' }}>{order.customerName}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', margin: 0 }}>{order.email}</p>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 0.75rem', fontSize: '0.875rem' }}>
                    {order.items}
                  </td>
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'right', fontWeight: 600 }}>
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: order.status === 'DELIVERED' ? '#10b98120' : 
                                  order.status === 'DISPATCHED' ? '#8b5cf620' :
                                  order.status === 'PAID' ? '#3b82f620' : '#f59e0b20',
                      color: order.status === 'DELIVERED' ? '#10b981' : 
                             order.status === 'DISPATCHED' ? '#8b5cf6' :
                             order.status === 'PAID' ? '#3b82f6' : '#f59e0b'
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'right', fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                    {order.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
