import { parseAvailabilitySlot } from '../src/models/availabilitySlot';
import { parseSwapRequest } from '../src/models/swapRequest';

describe('model parsers', () => {
  it('parses swap requests with extended fields', () => {
    const parsed = parseSwapRequest(
      {
        id: 9,
        from_user_id: 2,
        to_user_id: 5,
        status: 'accepted',
        message: 'Let us exchange skills',
        from_user_name: 'Alex',
        teach_skill_name: 'Python',
        learn_skill_name: 'UI Design',
        proposed_time: '2026-03-10 10:00:00',
        conversation_id: 14,
        created_at: '2026-03-08 09:00:00',
        updated_at: '2026-03-08 09:30:00',
      },
      true,
    );

    expect(parsed.id).toBe(9);
    expect(parsed.fromUserId).toBe(2);
    expect(parsed.toUserId).toBe(5);
    expect(parsed.otherUserName).toBe('Alex');
    expect(parsed.conversationId).toBe(14);
    expect(parsed.teachSkillName).toBe('Python');
    expect(parsed.learnSkillName).toBe('UI Design');
  });

  it('parses availability slots', () => {
    const parsed = parseAvailabilitySlot({
      id: '3',
      day_of_week: '4',
      start_time: '09:00:00',
      end_time: '11:00:00',
    });

    expect(parsed.id).toBe(3);
    expect(parsed.dayOfWeek).toBe(4);
    expect(parsed.startTime).toBe('09:00:00');
    expect(parsed.endTime).toBe('11:00:00');
  });
});

