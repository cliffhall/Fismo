/**
 * Domain Enum: Guard
 * @author Cliff Hall <cliff@futurescale.com>
 */
const NODE = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');
class Guard {}

Guard.EXIT = 0;
Guard.ENTER = 1;

Guard.Modes = [Guard.EXIT, Guard.ENTER];

// Export
if (NODE) {
    module.exports = Guard;
} else {
    window.Mode = Guard;
}