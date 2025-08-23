import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { 
  Download, 
  FileText, 
  Printer, 
  Eye, 
  FileSpreadsheet,
  FileX
} from "lucide-react"
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

interface DataTableColumn {
  key: string
  label: string
}

interface DataTableActionsProps {
  data?: Record<string, any>[]
  columns?: DataTableColumn[]
  filename?: string
  visibleColumns?: string[]
  onColumnVisibilityChange?: (columns: string[]) => void
  className?: string
}

export default function DataTableActions({ 
  data = [], 
  columns = [], 
  filename = "data",
  visibleColumns = [],
  onColumnVisibilityChange = () => {},
  className = "flex justify-center items-center flex-wrap"
}: DataTableActionsProps) {
  const [isExporting, setIsExporting] = useState(false)

  // Convert data to CSV format
  const exportToCSV = () => {
    if (!data.length) return

    const headers = columns
      .filter(col => visibleColumns.includes(col.key))
      .map(col => col.label)
      .join(',')
    
    const rows = data.map(row => 
      columns
        .filter(col => visibleColumns.includes(col.key))
        .map(col => {
          const value = row[col.key] || ''
          // Escape commas and quotes in CSV
          return `"${String(value).replace(/"/g, '""')}"`
        })
        .join(',')
    )

    const csvContent = [headers, ...rows].join('\n')
    downloadFile(csvContent, `${filename}.csv`, 'text/csv')
  }

  // Convert data to Excel format (basic CSV with .xlsx extension)
  const exportToExcel = () => {
    if (!data.length) return
    
    // For now, we'll use CSV format with xlsx extension
    // In production, you might want to use a library like xlsx
    exportToCSV()
    // TODO: Implement proper Excel export with xlsx library
  }

  // Print table
  const printTable = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    
    const tableHTML = generateTableHTML()
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Print ${filename}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            @media print { 
              body { margin: 0; } 
              table { font-size: 12px; }
            }
          </style>
        </head>
        <body>
          <h2>${filename}</h2>
          ${tableHTML}
        </body>
      </html>
    `)
    
    printWindow.document.close()
    printWindow.print()
  }

  // Export to PDF using jsPDF
  const exportToPDF = () => {
    if (!data.length) return

    setIsExporting(true)
    
    try {
      const doc = new jsPDF()
      
      // Add title
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text(filename.toUpperCase(), 14, 15)
      
      // Prepare data for the table
      const headers = columns
        .filter(col => visibleColumns.includes(col.key))
        .map(col => col.label)
      
      const rows = data.map(row => 
        columns
          .filter(col => visibleColumns.includes(col.key))
          .map(col => {
            let value = row[col.key] || ''
            // Handle different data types
            if (typeof value === 'object' && value !== null) {
              value = JSON.stringify(value)
            }
            return String(value)
          })
      )

      // Add table using autoTable
      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 25,
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [63, 81, 181],
          textColor: 255,
          fontSize: 9,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { top: 25, left: 14, right: 14 },
        theme: 'striped'
      })

      // Save the PDF
      doc.save(`${filename}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  // Generate HTML table for printing
  const generateTableHTML = () => {
    const headers = columns
      .filter(col => visibleColumns.includes(col.key))
      .map(col => `<th>${col.label}</th>`)
      .join('')

    const rows = data.map(row => 
      '<tr>' + 
      columns
        .filter(col => visibleColumns.includes(col.key))
        .map(col => `<td>${row[col.key] || ''}</td>`)
        .join('') +
      '</tr>'
    ).join('')

    return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`
  }

  // Download file helper
  const downloadFile = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Toggle column visibility
  const toggleColumn = (columnKey: string, checked: boolean) => {
    let newVisibleColumns: string[]
    if (checked) {
      newVisibleColumns = [...visibleColumns, columnKey]
    } else {
      newVisibleColumns = visibleColumns.filter(key => key !== columnKey)
    }
    onColumnVisibilityChange(newVisibleColumns)
  }

  return (
    <div className={className}>
      {/* Export to CSV */}
      <Button
        variant="outline"
        size="sm"
        onClick={exportToCSV}
        disabled={!data.length || isExporting}
        className="h-8 rounded-none hover:bg-gray-300"
      >
        <FileText className="h-4 w-4 mr-2" />
        CSV
      </Button>

      {/* Export to Excel */}
      <Button
        variant="outline"
        size="sm"
        onClick={exportToExcel}
        disabled={!data.length || isExporting}
        className="h-8 rounded-none hover:bg-gray-300"
      >
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        Excel
      </Button>

      {/* Print */}
      <Button
        variant="outline"
        size="sm"
        onClick={printTable}
        disabled={!data.length}
        className="h-8 rounded-none hover:bg-gray-300"
      >
        <Printer className="h-4 w-4 mr-2" />
        Print
      </Button>

      {/* Export to PDF */}
      <Button
        variant="outline"
        size="sm"
        onClick={exportToPDF}
        disabled={!data.length || isExporting}
        className="h-8 rounded-none hover:bg-gray-300"
      >
        <FileX className="h-4 w-4 mr-2" />
        PDF
      </Button>

      {/* Column Visibility */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 rounded-none hover:bg-gray-300">
            <Eye className="h-4 w-4 mr-2" />
            Columns
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {columns.map((column) => (
            <DropdownMenuCheckboxItem
              key={column.key}
              className="capitalize"
              checked={visibleColumns.includes(column.key)}
              onCheckedChange={(checked) => toggleColumn(column.key, checked)}
            >
              {column.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}