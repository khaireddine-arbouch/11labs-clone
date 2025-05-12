import React from "react";
import { PageLayout } from "~/components/client/page-layout";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { getHistoryItems } from "~/lib/history";
import { VoiceChanger } from "~/components/speech-synthesis/voice-changer";

export default async function SpeechToSpeech() {
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
  const service = "seedvc";

  const historyItems = await getHistoryItems(service);
  return (
    <PageLayout
      title={"Voice Converter"}
      service={service}
      historyItems={historyItems}
    >
      <VoiceChanger service={service} credits={credits}/>
    </PageLayout>
  );
}
