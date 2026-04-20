const React = require('react');
const MockSvgIcon = (props) => React.createElement('svg', { 'data-testid': 'mock-svg-icon', ...props });
module.exports = MockSvgIcon;
