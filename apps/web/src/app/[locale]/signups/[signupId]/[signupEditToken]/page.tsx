import { notFound } from "next/navigation";
import { getSignup } from "../../../../../lib/api/external/ilmomasiina";
import { openGraphImage } from "../../../../shared-metadata";
import {
  deleteSignUpAction,
  saveSignUpAction,
} from "../../../../../lib/api/external/ilmomasiina/actions";
import { getScopedI18n } from "../../../../../locales/server";
import { SignupForm } from "./signup-form";

interface PageProps {
  params: {
    signupId: string;
    signupEditToken: string;
  };
}

export const generateMetadata = async ({
  params: { signupId, signupEditToken },
}: PageProps) => {
  const signupInfo = await getSignup(signupId, signupEditToken);
  const t = await getScopedI18n("ilmomasiina.form");

  if (!signupInfo.ok) {
    return {};
  }

  return {
    title: `${t("Edit sign up")} - ${signupInfo.data.event.title}`,
    description: signupInfo.data.event.description,
    openGraph: {
      ...openGraphImage,
    },
  };
};

export default async function Page({
  params: { signupId, signupEditToken },
}: PageProps) {
  const signupInfo = await getSignup(signupId, signupEditToken);

  if (!signupInfo.ok && signupInfo.error === "ilmomasiina-signup-not-found") {
    notFound();
  }

  if (!signupInfo.ok) {
    throw new Error("Failed to fetch signup info");
  }

  const t = await getScopedI18n("ilmomasiina.form");

  return (
    <main
      id="main"
      className="relative mb-8 flex flex-col items-center gap-2 md:gap-6"
    >
      <div className="relative flex max-w-4xl flex-col items-center gap-8 p-4 md:p-6">
        <hgroup className="space-y-4 text-pretty">
          <h1 className="font-mono text-2xl md:text-4xl">
            {t("Edit sign up")} - {signupInfo.data.event.title}
          </h1>
          <p>
            {signupInfo.data.signup.status === "in-queue"
              ? t("You are in queue at position {position}", {
                  position: signupInfo.data.signup.position,
                })
              : t(
                  "You are in the quota {quotaName} at position {position}/{quotaSize}",
                  {
                    quotaName: signupInfo.data.signup.quota.title,
                    position: signupInfo.data.signup.position,
                    quotaSize: signupInfo.data.signup.quota.size,
                  },
                )}
          </p>
        </hgroup>
        <SignupForm
          signupId={signupId}
          signupEditToken={signupEditToken}
          signup={signupInfo.data.signup}
          event={signupInfo.data.event}
          saveAction={saveSignUpAction}
          deleteAction={deleteSignUpAction}
        />
        <footer className="text-sm text-gray-800">
          <p>
            {t(
              "Note: Sign up integration is in beta, if you encounter any issues you can sign up directly on the event page: {eventUrl}",
              {
                eventUrl: `${process.env.PUBLIC_ILMOMASIINA_URL ?? ""}/signup/${signupId}/${signupEditToken}`,
              },
            )}
          </p>
        </footer>
      </div>
    </main>
  );
}