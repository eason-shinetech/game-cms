import dbConnect from "@/lib/db";
import { convertToMongoId } from "@/lib/utils";
import GameModel from "@/models/game";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const keyword = searchParams.get("keyword");
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 20;
    const sort = searchParams.get("sort");
    const order = searchParams.get("order") === "asc" ? 1 : -1;
    const status = searchParams.get("status");
    const categoryId = searchParams.get("categoryId");
    await dbConnect();
    const skip = (page - 1) * pageSize;
    const dbquery = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { fetchFrom: { $regex: keyword, $options: "i" } },
      ],
    };
    const conds: any[] = [];
    if (status) {
      conds.push({ status: status });
    }
    if (categoryId) {
      conds.push({ categoryIds: convertToMongoId(categoryId) });
    }
    if (keyword) {
      conds.push(dbquery);
    }
    const aggr: any[] = [];
    if (conds.length > 0) {
      aggr.push({
        $match: { $and: conds },
      });
    }
    const facets = [];
    if (sort && order) {
      facets.push({
        $sort: { [sort]: order },
      });
    } else {
      facets.push({
        $sort: { title: 1 },
      });
    }
    facets.push(
      ...[
        {
          $skip: skip,
        },
        {
          $limit: pageSize,
        },
      ]
    );
    aggr.push({
      $facet: {
        total: [{ $count: "total" }],
        data: facets,
      },
    });
    // 聚合查询
    console.log("[Get Game List Query]:", JSON.stringify(aggr))
    const result = await GameModel.aggregate(aggr);
    let total = 0;
    let data = [];
    if (result.length > 0) {
      total = result[0].total.length ? result[0].total[0].total : 0;
      data = result[0].data;
    }
    return NextResponse.json({ total, data });
  } catch (err) {
    console.log("[Get Game List Error]:", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
