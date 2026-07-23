import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { ArrowLeft } from 'lucide-react'
import { useProduct, useProductMutation } from '@/hooks/useProducts'
import { PageHeader } from '@/components/common/PageHeader'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { CategoryCombobox } from '@/components/forms/CategoryCombobox'
import { SupplierCombobox } from '@/components/forms/SupplierCombobox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Link } from 'react-router-dom'
import { generateSKU } from '@/lib/utils'

interface ProductFormData {
  name: string; sku: string; description: string
  category_id: string; supplier_id: string
  unit_price: string; cost_price: string; unit: string
  image: string; status: string
}

export default function ProductFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const productId = id ? Number(id) : null

  const { data: product, isLoading: loadingProduct } = useProduct(productId)
  const { create, update } = useProductMutation()

  const { register, handleSubmit, control, formState: { errors }, reset, setValue } = useForm<ProductFormData>({
    defaultValues: {
      name: '', sku: '', description: '', category_id: '',
      supplier_id: '', unit_price: '', cost_price: '',
      unit: 'pcs', image: '', status: 'active',
    },
  })

  useEffect(() => {
    if (product && isEdit) {
      reset({
        name: product.name,
        sku: product.sku,
        description: product.description ?? '',
        category_id: String(product.category_id),
        supplier_id: product.supplier_id ? String(product.supplier_id) : '',
        unit_price: String(product.unit_price),
        cost_price: String(product.cost_price),
        unit: product.unit,
        image: product.image ?? '',
        status: product.status,
      })
    }
  }, [product, isEdit, reset])

  const onSubmit = async (data: ProductFormData) => {
    const payload = {
      ...data,
      category_id: Number(data.category_id),
      supplier_id: data.supplier_id ? Number(data.supplier_id) : null,
      unit_price: parseFloat(data.unit_price),
      cost_price: parseFloat(data.cost_price),
      status: data.status as 'active' | 'inactive' | 'discontinued',
    }
    if (isEdit && productId) {
      await update.mutateAsync({ id: productId, data: payload })
    } else {
      await create.mutateAsync(payload)
    }
    navigate('/products')
  }

  if (isEdit && loadingProduct) return <LoadingSpinner className="min-h-[400px]" />

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link to="/products">
          <Button variant="ghost" size="sm"><ArrowLeft className="size-4 mr-1" />Back</Button>
        </Link>
        <PageHeader title={isEdit ? 'Edit Product' : 'New Product'} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader><CardTitle>Product Information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label>Product Name *</Label>
              <Input {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })} className="mt-1" />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label>SKU *</Label>
              <div className="flex gap-2 mt-1">
                <Input {...register('sku', { required: 'SKU is required' })} />
                <Button type="button" variant="outline" size="sm" onClick={() => setValue('sku', generateSKU())}>
                  Auto
                </Button>
              </div>
              {errors.sku && <p className="text-xs text-destructive mt-1">{errors.sku.message}</p>}
            </div>

            <div>
              <Label>Unit *</Label>
              <Input {...register('unit', { required: 'Unit is required' })} placeholder="pcs/kg/box/roll..." className="mt-1" />
              {errors.unit && <p className="text-xs text-destructive mt-1">{errors.unit.message}</p>}
            </div>

            <div>
              <Label>Category *</Label>
              <Controller
                name="category_id"
                control={control}
                rules={{ required: 'Category is required' }}
                render={({ field }) => (
                  <div className="mt-1">
                    <CategoryCombobox value={field.value} onChange={field.onChange} />
                  </div>
                )}
              />
              {errors.category_id && <p className="text-xs text-destructive mt-1">{errors.category_id.message}</p>}
            </div>

            <div>
              <Label>Supplier</Label>
              <Controller
                name="supplier_id"
                control={control}
                render={({ field }) => (
                  <div className="mt-1">
                    <SupplierCombobox value={field.value} onChange={field.onChange} />
                  </div>
                )}
              />
            </div>

            <div>
              <Label>Unit Price *</Label>
              <Input
                type="number"
                step="0.01"
                {...register('unit_price', { required: 'Unit price is required', min: { value: 0, message: 'Must be >= 0' } })}
                className="mt-1"
              />
              {errors.unit_price && <p className="text-xs text-destructive mt-1">{errors.unit_price.message}</p>}
            </div>

            <div>
              <Label>Cost Price *</Label>
              <Input
                type="number"
                step="0.01"
                {...register('cost_price', { required: 'Cost price is required', min: { value: 0, message: 'Must be >= 0' } })}
                className="mt-1"
              />
              {errors.cost_price && <p className="text-xs text-destructive mt-1">{errors.cost_price.message}</p>}
            </div>

            <div>
              <Label>Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="discontinued">Discontinued</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label>Image URL</Label>
              <Input {...register('image')} placeholder="https://..." className="mt-1" />
            </div>

            <div className="sm:col-span-2">
              <Label>Description</Label>
              <Textarea {...register('description')} className="mt-1" rows={3} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2 mt-4">
          <Link to="/products">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={create.isPending || update.isPending}>
            {create.isPending || update.isPending ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  )
}
