import React, { Component } from 'react';
import axios from 'axios';
import { Grid, Header, Input, Button } from 'semantic-ui-react';
import Tweets from './Tweets';

class App extends Component {
  state = { tweets: [], visible: [], search: '', tweet: '' }

  componentDidMount() {
    axios.get('/api/tweets')
      .then( res => this.setState({ tweets: res.data }))
      .catch( err => console.log(err))
  }

  handleChange = (e) => {
    this.setState({ search: e.target.value }, () => {
      this.updateVisible()
    });
  }

  updateVisible = () => {
    const { search, tweets } = this.state;
    if (search.length === 0)
      this.setState({ visible: tweets });
    else if (search.length > 3) {
      axios.get(`/api/search?term=${search}`)
        .then( res => this.setState({ visible: res.data }) )
    } 
  }

  updateTweet = (e) => {
    this.setState({ tweet: e.target.value })
  }

  postTweet = () => {
    const { tweet, visible } = this.state;
    if (tweet) {
      axios.post('/api/tweet', { tweet })
        .then( res => this.setState({ tweet: '', visible: [...visible, res.data] }) )
    }
  }

  render() {
    return(
      <Grid>
        <Grid.Row>
          <Grid.Column mobile={16} tablet={16} computer={4}>
            <Header textAlign='center'>Search</Header>
            <Input
              value={this.state.search}
              onChange={this.handleChange}
              icon={{ name: 'search', circular: true }}
              placeholder='Search...'
            />

            <hr />
            <Header>Tweet Something</Header>
            <Input onChange={this.updateTweet} value={this.state.tweet} />
            <Button onClick={this.postTweet}>Tweet!</Button>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={16} computer={10}>
            <Tweets tweets={this.state.visible} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default App;