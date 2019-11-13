const React = require('react');

const axios = require('axios');

const { get } = require('lodash');

const Line = require('./Line.jsx');

class LineStatuses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lines: [],
    };
  }

  componentDidMount() {
    const proxyEndpoint = 'http://localhost:3003/all';
    axios.get(proxyEndpoint)
      .then(({ data }) => {
        console.log(data);
        this.setState({
          lines: get(data, 'eventMessage', []),
        });
      });
  }

  render() {
    const {
      lines,
    } = this.state;

    return (
      <div>
        {
          lines.map(line => (
            <Line
              key={line.line}
              line={line.line}
              status={line.status}
            />
          ))
        }
      </div>
    );
  }
}

module.exports = LineStatuses;
