import React, { Component } from 'react';
import {
  Button, TextField, LinearProgress, TableBody, Table,
  TableContainer, TableHead, TableRow, TableCell
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import swal from 'sweetalert';
const axios = require('axios');

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      id: '',
      file: '',
      fileName: '',
      page: 1,
      search: '',
      result: [],
      pages: 0,
      loading: false
    };
  }

  componentDidMount = () => {
    this.getArtical();
  }

  getArtical = () => {

    this.setState({ loading: true });

    axios.get(`http://content.guardianapis.com/search?api-key=test&amp;q=${this.state.search}&amp;show-fields=thumbnail,headline&amp;show-tags=keyword&amp;page=${this.state.page}&amp;page-size=10`).
      then((res) => {
        console.log('aaaaaaa', res.data.response)
        this.setState({ loading: false, result: res.data.response.results, pages: res.data.response.pages });
      }).catch((err) => {
        console.log('errrrr', err)
        swal({
          text: 'Error',
          icon: "error",
          type: "error"
        });
        this.setState({ loading: false, result: [], pages: 0 }, () => { });
      });
  }

  pageChange = (e, page) => {
    this.setState({ page: page }, () => {
      this.getArtical();
    });
  }

  logOut = () => {
    localStorage.setItem('token', null);
    this.props.history.push('/');
  }

  search = (search_tag) => {

    this.setState({ search: search_tag }, () => { });
    this.getArtical();

  }

  onChange = (e) => {
    if (e.target.files && e.target.files[0] && e.target.files[0].name) {
      this.setState({ fileName: e.target.files[0].name }, () => { });
    }
    this.setState({ [e.target.name]: e.target.value }, () => { });
  };

  render() {
    return (
      <div>
        {this.state.loading && <LinearProgress size={40} />}
        <div style={{textAlign:'center'}}>
          <h2>Dashboard</h2>
          <TextField
            id="standard-basic"
            type="search"
            autoComplete="off"
            name="search"
            value={this.state.search}
            onChange={this.onChange}
            placeholder="Enter Search Text"
            required
          />
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            disabled={this.state.search == ''}
            onClick={(e)=>{this.search(this.state.search)}}
          >
            Search
          </Button>
        </div>

        <br />

        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Image</TableCell>

                <TableCell align="center">Headline</TableCell>

                <TableCell align="center">Keyword</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.result.length >0 ? this.state.result.map((row) => (
                <TableRow key={row.webTitle}>

                  <TableCell align="center">
                    <a href={row.webUrl} target='_blank'>
                      <img src={row.thumbnailImage ? row.image : 'https://makitweb.com/demo/broken_image/images/noimage.png'} width="70" height="70" />
                    </a>
                  </TableCell>

                  <TableCell align="center" component="th" scope="row">
                    <a href={row.webUrl} target='_blank'>{row.webTitle}</a>
                  </TableCell>

                  <TableCell align="center" component="th" scope="row">

                    <Button
                      className="button_style"
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={(e)=>{this.search(row.pillarName)}}
                    >
                      {row.pillarName}
                    </Button>
                  </TableCell>

                </TableRow>
              )) : <h1>There Is no data found to display.</h1>}
            </TableBody>
          </Table>
          <br />
          <Pagination count={this.state.pages} page={this.state.page} onChange={this.pageChange} color="primary" />
        </TableContainer>

      </div>
    );
  }
}