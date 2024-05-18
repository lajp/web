/* eslint-disable no-alert -- TODO: Implement proper alerting system */
import * as React from "react";

export const ActionsView = (): React.JSX.Element => {
  const [resultMessage, setResultMessage] = React.useState<string>("");

  const importCommittees = async (
    csv: string,
    year: number,
  ): Promise<Response> =>
    await fetch("/api/committees/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ csv, year }),
    });

  const importCommitteePictures = async (
    zip: string,
    year: number,
  ): Promise<Response> =>
    await fetch("/api/committees/import-pictures", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ zip, year }),
    });

  const handleImport = async (
    e: React.FormEvent<HTMLFormElement>,
    importFunction: (content: string, year: number) => Promise<Response>,
  ): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();

    const formData = new FormData(e.currentTarget);

    const committeeYear: number = parseInt(formData.get("year") as string);
    if (Number.isNaN(committeeYear)) {
      alert("Invalid year");
      return;
    }

    const file = formData.get("file");
    if (!(file instanceof File)) {
      alert("Invalid file");
      return;
    }
    const content = await file.text();

    const result = await importFunction(content, committeeYear);
    if (result.ok) {
      setResultMessage("Import successful!");
    } else {
      setResultMessage(`Import failed. ${await result.text()}`);
    }

    setTimeout(() => {
      setResultMessage("");
    }, 5000);
  };

  const handleCommitteeImport = (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => handleImport(e, importCommittees);

  const handlePicturesImport = (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => handleImport(e, importCommitteePictures);

  return (
    <div style={{ margin: 20 }}>
      <a href="/admin">Back</a>
      <h1>Actions</h1>

      <p
        style={{
          color: "red",
          fontSize: "2em",
          WebkitTextStroke: "1px white",
          border: "2px solid red",
          padding: "10px",
        }}
      >
        ⚠️ DO NOT TOUCH UNLESS YOU KNOW WHAT YOU'RE DOING! ⚠️
      </p>
      {resultMessage && (
        <p
          style={{
            color: "green",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "2em",
            zIndex: 1000,
          }}
        >
          {resultMessage}
        </p>
      )}

      <h2>Import committees</h2>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 10,
          margin: "20px",
        }}
        onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
          void handleCommitteeImport(e)
        }
      >
        <label htmlFor="year">Committee year</label>
        <input
          id="year"
          name="year"
          type="number"
          placeholder="Committee year"
          defaultValue={new Date().getFullYear().toString()}
        />
        <label htmlFor="file" className="sr-only">
          Choose a csv file
        </label>
        <input id="file" name="file" type="file" />
        <button type="submit">Upload</button>
      </form>

      <h2>Import committee pictures</h2>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 10,
          margin: "20px",
        }}
        onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
          void handlePicturesImport(e)
        }
      >
        <label htmlFor="year">Committee year</label>
        <input
          id="year"
          name="year"
          type="number"
          placeholder="Committee year"
          defaultValue={new Date().getFullYear().toString()}
        />
        <label htmlFor="file" className="sr-only">
          Choose a zip file
        </label>
        <input id="file" name="file" type="file" />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export const ActionsLink = (): React.JSX.Element => {
  return <a href="/admin/actions">Actions</a>;
};
