import dbConnect from "@/lib/db";
import { convertToMongoId } from "@/lib/utils";
import GameModel from "@/models/game";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const title = searchParams.get("title");
    const categoryName = searchParams.get("categoryName");
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 20;
    const conds: any[] = [{ status: "published" }];
    await dbConnect();
    if (categoryName) {
      conds.push({ categories: categoryName });
    }
    if (title) {
      conds.push({
        title: {
          $regex: title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          $options: "i",
        },
      });
    }
    const aggr: any[] = [
      { $match: { $and: conds } },
      { $project: { title: 1, titleUrl: 1, thumb: 1, clickCount: 1 } },
      {
        $facet: {
          total: [{ $count: "total" }],
          data: [
            { $sort: { clickCount: -1, updatedAt: -1, title: 1 } },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
          ],
        },
      },
    ];
    const result = await GameModel.aggregate(aggr);
    let total = 0;
    let data = [];
    if (result.length > 0) {
      total = result[0].total.length ? result[0].total[0].total : 0;
      data = result[0].data;
    }
    return NextResponse.json({ total, data });
  } catch (err) {
    console.log("[Search Error]: ", err);
    return new NextResponse("Failed to fetch all prompts", { status: 500 });
  }
}
