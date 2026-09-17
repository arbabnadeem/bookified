"use server";

import { connectToDatabase } from "@/database/mongoose";
import { CreateBook, TextSegment } from "@/types";
import { generateSlug, serializeData } from "@/lib/utils";
import Book from "@/database/models/book.model";
import BookSegment from "@/database/models/book-segment.model";

export const checkBookExists = async (title: string) => {
  try {
    await connectToDatabase();

    const slug = generateSlug(title);

    const existingBook = await Book.findOne({ slug }).lean();

    if (existingBook) {
      return {
        success: true,
        data: serializeData(existingBook),
      };
    }
  } catch (error) {
    console.error("error checking book existing", error);
    return {
      exists: false,
      error: error,
    };
  }
};

export const createBook = async (data: CreateBook) => {
  try {
    await connectToDatabase();

    const slug = generateSlug(data.title);

    const existingBook = await Book.findOne({ slug }).lean();

    if (existingBook) {
      return {
        success: false,
        data: serializeData(existingBook),
        alreadyExists: true,
      };
    }

    // check subscription limits before creating a book : Todo

    const book = await Book.create({ ...data, slug, totalSegments: 0 });

    return {
      success: true,
      data: serializeData(book),
    };
  } catch (error) {
    console.log("error creating a book", error);
    return {
      success: false,
      error: error,
    };
  }
};

export const saveBookSegments = async (
  bookId: string,
  clerkId: string,
  segment: TextSegment[],
) => {
  try {
    await connectToDatabase();

    console.log("saving book segment");

    const segmentsToInsert = segment.map(
      ({ text, segmentIndex, pageNumber, wordCount }) => ({
        clerkId,
        bookId,
        content: text,
        segmentIndex,
        pageNumber,
        wordCount,
      }),
    );

    await BookSegment.insertMany(segmentsToInsert);

    await Book.findByIdAndUpdate(bookId, { totalSegments: segment.length });

    console.log("Book segment saved successfully");

    return {
      success: true,
      data: { segmentCreated: segment.length },
    };
  } catch (error) {
    console.log("error saving book segments", error);
    await BookSegment.deleteMany({ bookId });
    await Book.findByIdAndDelete(bookId);
    console.log("Deleted bok segment and book sue to failure to save segments");

    return {
      success: false,
    };
  }
};
