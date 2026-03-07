import { asInt, asRecord, asString } from './parse';

export interface AvailabilitySlot {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export function parseAvailabilitySlot(value: unknown): AvailabilitySlot {
  const json = asRecord(value);
  return {
    id: asInt(json.id),
    dayOfWeek: asInt(json.day_of_week),
    startTime: asString(json.start_time),
    endTime: asString(json.end_time),
  };
}

