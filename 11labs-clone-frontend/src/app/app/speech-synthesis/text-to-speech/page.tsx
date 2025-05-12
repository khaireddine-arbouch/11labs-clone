import React from "react";
import { PageLayout } from "~/components/client/page-layout";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { getHistoryItems } from "~/lib/history";
import TextToSpeechEditor from "../../../../components/speech-synthesis/text-to-speech-editor";

export default async function TextToSpeech() {
  const session = await auth();
  const userId = session?.user.id;

  let credits = 0;

  if (userId) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        credits: true,
      },
    });

    credits = user?.credits ?? 0;
  }
  const service = "styletts2";

  const historyItems = await getHistoryItems(service);
  return (
    <PageLayout
      title={"Text to Speech"}
      service={service}
      historyItems={historyItems}
    >
      <TextToSpeechEditor service={service} credits={credits}/>
    </PageLayout>
  );
}
