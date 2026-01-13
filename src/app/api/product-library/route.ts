import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const subcategoryId = searchParams.get("subcategory_id");

    let query = supabase
      .from("product_library")
      .select(`
        *,
        subcategory:subcategories(
          id,
          name,
          slug,
          category:categories(id, name, slug)
        )
      `)
      .order("display_order", { ascending: true });

    if (subcategoryId) {
      query = query.eq("subcategory_id", subcategoryId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { subcategory_id, name, description, image_url, amazon_affiliate_link, display_order, is_featured } = body;

    if (!subcategory_id || !name || !description || !image_url || !amazon_affiliate_link) {
      return NextResponse.json(
        { error: "Missing required fields: subcategory_id, name, description, image_url, amazon_affiliate_link" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("product_library")
      .insert({
        subcategory_id,
        name,
        description,
        image_url,
        amazon_affiliate_link,
        display_order: display_order || 0,
        is_featured: is_featured || false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, subcategory_id, name, description, image_url, amazon_affiliate_link, display_order, is_featured } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    }

    const updateData: any = {};
    if (subcategory_id !== undefined) updateData.subcategory_id = subcategory_id;
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (amazon_affiliate_link !== undefined) updateData.amazon_affiliate_link = amazon_affiliate_link;
    if (display_order !== undefined) updateData.display_order = display_order;
    if (is_featured !== undefined) updateData.is_featured = is_featured;

    const { data, error } = await supabase
      .from("product_library")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    }

    const { error } = await supabase.from("product_library").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
