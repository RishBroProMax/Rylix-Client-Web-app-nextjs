import { google } from "googleapis"
import type { Meeting, MeetingAttendee } from "@prisma/client"

// Set up Google Calendar API
const calendar = google.calendar({
  version: "v3",
  auth: new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/calendar"],
  }),
})

interface MeetingWithAttendees extends Meeting {
  attendees: (MeetingAttendee & {
    user: {
      id: string
      name: string
      email: string
    }
  })[]
}

export async function createGoogleCalendarEvent(meeting: MeetingWithAttendees) {
  try {
    const attendees = meeting.attendees.map((attendee) => ({
      email: attendee.user.email,
      displayName: attendee.user.name,
      responseStatus: attendee.status.toLowerCase(),
    }))

    const event = {
      summary: meeting.title,
      description: meeting.description || "",
      start: {
        dateTime: meeting.meetingDate.toISOString(),
        timeZone: "UTC",
      },
      end: {
        dateTime: new Date(meeting.meetingDate.getTime() + (meeting.duration || 60) * 60000).toISOString(),
        timeZone: "UTC",
      },
      location: meeting.location,
      conferenceData: meeting.meetingLink
        ? {
            conferenceUrl: meeting.meetingLink,
            conferenceSolution: {
              key: {
                type: "hangoutsMeet",
              },
              name: "Google Meet",
            },
          }
        : undefined,
      attendees,
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 30 },
        ],
      },
    }

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
      conferenceDataVersion: 1,
    })

    return response.data
  } catch (error) {
    console.error("Error creating Google Calendar event:", error)
    throw error
  }
}

export async function updateGoogleCalendarEvent(eventId: string, meeting: MeetingWithAttendees) {
  try {
    const attendees = meeting.attendees.map((attendee) => ({
      email: attendee.user.email,
      displayName: attendee.user.name,
      responseStatus: attendee.status.toLowerCase(),
    }))

    const event = {
      summary: meeting.title,
      description: meeting.description || "",
      start: {
        dateTime: meeting.meetingDate.toISOString(),
        timeZone: "UTC",
      },
      end: {
        dateTime: new Date(meeting.meetingDate.getTime() + (meeting.duration || 60) * 60000).toISOString(),
        timeZone: "UTC",
      },
      location: meeting.location,
      conferenceData: meeting.meetingLink
        ? {
            conferenceUrl: meeting.meetingLink,
            conferenceSolution: {
              key: {
                type: "hangoutsMeet",
              },
              name: "Google Meet",
            },
          }
        : undefined,
      attendees,
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 30 },
        ],
      },
    }

    const response = await calendar.events.update({
      calendarId: "primary",
      eventId,
      requestBody: event,
      conferenceDataVersion: 1,
    })

    return response.data
  } catch (error) {
    console.error("Error updating Google Calendar event:", error)
    throw error
  }
}

export async function deleteGoogleCalendarEvent(eventId: string) {
  try {
    await calendar.events.delete({
      calendarId: "primary",
      eventId,
    })

    return true
  } catch (error) {
    console.error("Error deleting Google Calendar event:", error)
    throw error
  }
}

