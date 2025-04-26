import { NextRequest, NextResponse } from 'next/server';
import { Category } from '@/models/Category';
import Product from '@/models/Product';
import { connectDB } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { category: string } }) {
  try {
    await connectDB();

    const categoryId = params.category;

    if (!categoryId) {
      return NextResponse.json(
        { message: "Missing category ID" },
        { status: 400 }
      );
    }

    const productTypeRecord = await Category.findById(categoryId);
    if (!productTypeRecord) {
      return NextResponse.json(
        { message: "Product type not found" },
        { status: 404 }
      );
    }

    // Obtener parámetros de paginación
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");
    const skip = (page - 1) * limit;

    // Consulta con paginación
    const [products, total] = await Promise.all([
      Product.find({ category: categoryId }).skip(skip).limit(limit),
      Product.countDocuments({ category: categoryId }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      products,
      totalPages,
      currentPage: page,
      totalItems: total,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Error fetching products", error },
      { status: 500 }
    );
  }
}
