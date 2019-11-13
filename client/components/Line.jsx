const React = require('react');

class Line extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { line, status } = this.props;
    return (
      <div style={{ color: status === 'DELAYED' ? 'red' : 'green' }}>
        {`${line}: ${status}`}
      </div>
    )
  }
}

module.exports = Line;
