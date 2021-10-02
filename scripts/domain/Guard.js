/**
 * Domain Enum: Guard
 * @author Cliff Hall <cliff@futurescale.com>
 */
const NODE = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');
class Guard {}

Guard.ENTER = 0;
Guard.EXIT = 1;

Guard.Modes = [Guard.ENTER, Guard.EXIT];

// Export
if (NODE) {
    module.exports = Guard;
} else {
    window.Mode = Guard;
}