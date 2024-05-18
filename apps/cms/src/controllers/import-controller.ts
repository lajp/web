import type { Response } from "express";
import type { PayloadRequest } from "payload/types";
import { signedIn } from "../access/signed-in";
import { importCommittees } from "../util/import";

export const importCommitteeController = async (
  req: PayloadRequest,
  res: Response,
): Promise<void> => {
  if (!signedIn({ req }) || !req.user) {
    res.sendStatus(401);
  }

  const { csv, year } = req.body as {
    csv: string;
    year: number;
  };

  if (!csv || !year) {
    res.status(400).send("Missing required fields");
  }

  const error = await importCommittees(csv, year);

  if (!error) {
    res.sendStatus(200);
  } else {
    res.status(500).send(error);
  }
};

export const importCommitteePictureController = async (
  req: PayloadRequest,
  res: Response,
): Promise<void> => {
  if (!signedIn({ req }) || !req.user) {
    res.sendStatus(401);
  }

  const { zip, year } = req.body as {
    zip: string;
    year: number;
  };

  if (!zip || !year) {
    res.status(400).send("Missing required fields");
  }

  const error = await importCommittees(zip, year);

  if (!error) {
    res.sendStatus(200);
  } else {
    res.status(500).send(error);
  }
};
