export const newSpokenMedia = ({
  mediaId,
  transcript,
  audioUrls
}: {
  mediaId: string
  transcript: string
  audioUrls: string[]
}) => {
  return {
    mediaId,
    transcript,
    audioUrls
  }
}
