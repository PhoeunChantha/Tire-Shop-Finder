import { useState, useEffect } from "react"
import { router } from "@inertiajs/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, Filter, Calendar, Tag } from "lucide-react"
import DataTableActions from "@/components/DataTableActions"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
} from "@/components/ui/card"

// Individual Filter Components
export function SearchFilter({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange("")}
          className="absolute right-1 top-1 h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

export function SelectFilter({ value, onChange, options, placeholder = "Select...", icon = null }) {
  const Icon = icon || Tag

  // Transform options to avoid empty string values which Radix UI doesn't allow
  const transformedOptions = options.map(option => ({
    ...option,
    value: option.value === "" ? "__all__" : option.value.toString()
  }))
  
  // Find the default option (usually empty string means "All")
  const defaultOption = transformedOptions.find(opt => opt.value === "__all__") || transformedOptions[0]
  
  // Map current value to transformed value
  const selectValue = value && value !== "" ? value.toString() : defaultOption.value

  const handleValueChange = (newValue) => {
    // If selecting the "All" option, pass empty string to the backend
    if (newValue === "__all__") {
      onChange("")
    } else {
      onChange(newValue)
    }
  }

  return (
    <div className="flex items-center gap-2 min-w-[150px]">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <Select value={selectValue} onValueChange={handleValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {transformedOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function DateRangeFilter({ startDate, endDate, onStartChange, onEndChange }) {
  const handleStartChange = (e) => {
    const value = e.target.value
    console.log('Start date changed:', value)
    onStartChange(value)
  }

  const handleEndChange = (e) => {
    const value = e.target.value
    console.log('End date changed:', value)
    onEndChange(value)
  }

  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <Input
        type="date"
        value={startDate || ""}
        onChange={handleStartChange}
        className="w-auto"
      />
      <span className="text-muted-foreground">to</span>
      <Input
        type="date"
        value={endDate || ""}
        onChange={handleEndChange}
        className="w-auto"
      />
    </div>
  )
}

export function PerPageSelector({ value, onChange }) {
  const currentValue = value ? value.toString() : "10"

  return (
    <Select value={currentValue} onValueChange={(val) => onChange(Number(val))}>
      <SelectTrigger className="w-[60px]">
        <SelectValue placeholder="Per page" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="5">5</SelectItem>
        <SelectItem value="10">10</SelectItem>
        <SelectItem value="25">25</SelectItem>
        <SelectItem value="50">50</SelectItem>
        <SelectItem value="100">100</SelectItem>
      </SelectContent>
    </Select>
  )
}


// Main DataTableFilter Component
export default function DataTableFilter({
  filters = {},
  config = {},
  onFilterChange,
  showAdvanced = false,
  data = [],
  columns = [],
  filename = "data",
  visibleColumns = [],
  onColumnVisibilityChange = () => { },
}) {
  const [localFilters, setLocalFilters] = useState(() => {
    // Initialize with proper default values to ensure all fields are controlled
    const defaultFilters = {
      search: "",
      per_page: 10,
      email_verified: "",
      created_date_start: "",
      created_date_end: "",
      page: 1
    }
    return { ...defaultFilters, ...filters }
  })
  const [showFilters, setShowFilters] = useState(showAdvanced)


  // Default config
  const defaultConfig = {
    search: {
      enabled: true,
      placeholder: "Search...",
      debounce: 300
    },
    perPage: {
      enabled: true,
      default: 10
    }
  }

  const mergedConfig = { ...defaultConfig, ...config }

  // Sync with URL params on component mount
  useEffect(() => {
    setLocalFilters(prev => {
      const defaultFilters = {
        search: "",
        per_page: 10,
        email_verified: "",
        created_date_start: "",
        created_date_end: "",
        page: 1
      }
      return { ...defaultFilters, ...filters }
    })
  }, [filters])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onFilterChange) {
        onFilterChange(localFilters)
      } else {
        // Default behavior - update URL
        const params = Object.fromEntries(
          Object.entries(localFilters).filter(([_, value]) => value !== "" && value != null)
        )

        router.get(window.location.pathname, params, {
          preserveState: true,
          preserveScroll: true,
        })
      }
    }, mergedConfig.search.debounce)

    return () => clearTimeout(timeoutId)
  }, [localFilters])

  const updateFilter = (key, value) => {
    console.log(`Updating filter: ${key} = ${value}`)
    setLocalFilters(prev => {
      const newFilters = {
        ...prev,
        [key]: value
      }
      console.log('New filters:', newFilters)
      return newFilters
    })
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      search: "",
      per_page: localFilters.per_page || mergedConfig.perPage.default,
      email_verified: "",
      created_date_start: "",
      created_date_end: "",
      page: 1
    }
    setLocalFilters(clearedFilters)
  }

  const hasActiveFilters = Object.entries(localFilters).some(
    ([key, value]) => key !== 'per_page' && key !== 'page' && value !== "" && value != null
  )

  return (

    <div className="space-y-4">

      {/* Advanced Filters Panel */}
      {showFilters && config.advancedFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {config.advancedFilters.map((filterConfig, index) => {
                if (filterConfig.type === 'select') {
                  return (
                    <SelectFilter
                      key={index}
                      value={localFilters[filterConfig.key]}
                      onChange={(value) => updateFilter(filterConfig.key, value)}
                      options={filterConfig.options}
                      placeholder={filterConfig.placeholder}
                      icon={filterConfig.icon}
                    />
                  )
                }

                if (filterConfig.type === 'date_range') {
                  return (
                    <DateRangeFilter
                      key={index}
                      startDate={localFilters[`${filterConfig.key}_start`]}
                      endDate={localFilters[`${filterConfig.key}_end`]}
                      onStartChange={(value) => updateFilter(`${filterConfig.key}_start`, value)}
                      onEndChange={(value) => updateFilter(`${filterConfig.key}_end`, value)}
                    />
                  )
                }


                return null
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Primary Filter Row */}
      <div className="flex items-center py-2 justify-between gap-4">
        {/* Per Page Selector */}
        {mergedConfig.perPage?.enabled && (
          <PerPageSelector
            value={localFilters.per_page}
            onChange={(value) => updateFilter('per_page', value)}
          />
        )}
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center flex-1 gap-4">
            {/* Quick Filters */}
            {config.quickFilters?.map((filterConfig, index) => {
              if (filterConfig.type === 'select') {
                return (
                  <SelectFilter
                    key={index}
                    value={localFilters[filterConfig.key]}
                    onChange={(value) => updateFilter(filterConfig.key, value)}
                    options={filterConfig.options}
                    placeholder={filterConfig.placeholder}
                    icon={filterConfig.icon}
                  />
                )
              }
              return null
            })}
            {/* Advanced Filters Toggle */}
            {config.advancedFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            )}
            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
          <DataTableActions
            data={data}
            columns={columns}
            filename={filename}
            visibleColumns={visibleColumns}
            onColumnVisibilityChange={onColumnVisibilityChange}
          />
          <div className="space-x-2">
            {/* Search Filter */}
            {mergedConfig.search?.enabled && (
              <SearchFilter
                value={localFilters.search}
                onChange={(value) => updateFilter('search', value)}
                placeholder={mergedConfig.search.placeholder}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
// use DataTableFilter
{/* <DataTableFilter
  filters={filters || {}}
  config={filterConfig}
  data={permissions.data || []}
  columns={columns}
  filename="permissions"
  visibleColumns={visibleColumns}
  onColumnVisibilityChange={setVisibleColumns}
/> */}
