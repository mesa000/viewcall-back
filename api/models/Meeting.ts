/**
 * Represents a meeting created by a user.
 */
export interface IMeeting {
  id: string; // Firestore document ID
  ownerId: string; // UID of the user who created the meeting
  title: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Build a complete meeting object before storing it in Firestore.
 *
 * @param data - Partial meeting payload supplied by the client.
 * @param ownerId - UID of the user who owns the meeting.
 * @returns Meeting object with defaults and timestamps applied.
 */
export const createMeetingData = (
  data: Partial<IMeeting>,
  ownerId: string
): IMeeting => {
  const now = new Date().toISOString();

  return {
    id: "", // Filled by the DAO when persisting
    ownerId,
    title: data.title ?? "",
    createdAt: now,
    updatedAt: now,
  };
};
