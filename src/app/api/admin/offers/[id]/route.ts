import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/auth-edge'

// PATCH /api/admin/offers/[id] - Update offer
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminSession(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { id } = await params
    const body = await request.json()
    
    const existing = await prisma.offer.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Offer not found' },
        { status: 404 }
      )
    }
    
    // Check if code already exists (if code changed)
    if (body.code && body.code !== existing.code) {
      const codeExists = await prisma.offer.findFirst({
        where: { code: body.code, id: { not: id } }
      })
      if (codeExists) {
        return NextResponse.json(
          { success: false, error: 'ಈ ಕೋಡ್ ಈಗಾಗಲೇ ಬಳಕೆಯಲ್ಲಿದೆ' },
          { status: 400 }
        )
      }
    }
    
    // Build update data - only include fields that are provided
    const updateData: Record<string, unknown> = {}
    
    if (body.name !== undefined) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description
    if (body.code !== undefined) updateData.code = body.code
    if (body.discountType !== undefined) updateData.discountType = body.discountType
    if (body.discountValue !== undefined) updateData.discountValue = body.discountValue
    if (body.minPurchase !== undefined) updateData.minPurchase = body.minPurchase
    if (body.maxDiscount !== undefined) updateData.maxDiscount = body.maxDiscount
    if (body.usageLimit !== undefined) updateData.usageLimit = body.usageLimit
    if (body.startDate !== undefined) updateData.startDate = new Date(body.startDate)
    if (body.endDate !== undefined) updateData.endDate = new Date(body.endDate)
    if (body.isActive !== undefined) updateData.isActive = body.isActive
    
    const offer = await prisma.offer.update({
      where: { id },
      data: updateData
    })
    
    return NextResponse.json({
      success: true,
      data: offer,
      message: 'Offer updated successfully'
    })
  } catch (error) {
    console.error('Error updating offer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update offer' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/offers/[id] - Delete offer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminSession(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { id } = await params
    
    await prisma.offer.delete({ where: { id } })
    
    return NextResponse.json({
      success: true,
      message: 'Offer deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting offer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete offer' },
      { status: 500 }
    )
  }
}
