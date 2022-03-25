/**
 * Fismo Domain Enum: Guard
 * @author Cliff Hall <cliff@futurescale.com>
 */
class Guard {}

Guard.ENTER = 0;
Guard.EXIT = 1;

Guard.Modes = [Guard.ENTER, Guard.EXIT];

// Export
module.exports = Guard;
