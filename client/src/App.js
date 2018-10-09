import React, { Component } from 'react';
import conf from './conf';
import { Pagination } from 'react-materialize'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      shopList: [],
      total: 0,
      perPage: 10,
      page: 1
    };

    this.getShoppingList = this.getShoppingList.bind(this);
    this.saveShoppingList = this.saveShoppingList.bind(this);
    this.saveState = this.saveState.bind(this);
    this.pageSelect = this.pageSelect.bind(this);
    this.validate = this.validate.bind(this);
  }

  // update state value on change
  saveState(event) {
    let name = event.target.name;
    this.setState({ [name]: event.target.value }, () => {
      if (['query', 'perPage'].indexOf(name) != -1) this.getShoppingList();
    });
  }

  // update state value on page selection
  pageSelect(i) {
    this.setState({ page: i }, () => {
      this.getShoppingList()
    })
  }

  // rest api call for getting all records from server
  getShoppingList() {
    var self = this;
    var paginate = '?perPage=' + this.state.perPage + '&page=' + this.state.page;
    var query = this.state.query ? '&search=' + this.state.query : '';
    fetch(conf.host + '/api/v1/resource' + paginate + query, {
      method: 'GET',
      credentials: 'same-origin', headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    })
      .then(function (response) {
        if (response.ok) return response.json();
        else alert('Failed to fetch shopping list!. Please try again');
      }).then(function (data) {
        self.setState({ shopList: data.items, total: data.pagination.total });
      });
  }

  // validation method
  validate() {
    if (!this.state.name) {
      alert('Name is required!');
      return false;
    }
    if (!this.state.status) {
      alert('Status is required!');
      return false;
    }
    return true;
  }

  // rest api for saveing the record details
  saveShoppingList() {
    var self = this;
    if (!this.validate())
      return;

    fetch(conf.host + '/api/v1/resource', {
      method: 'POST',
      credentials: 'same-origin', headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      body: JSON.stringify({
        name: this.state.name,
        shopName: this.state.shopName,
        status: this.state.status
      })
    })
      .then(function (response) {
        if (response.ok) { alert('Saved successfully!'); self.setState({ name: '', shopName: '', status: '' }); self.getShoppingList(); }
        else alert('Failed to create shopping details!. Please try again');
      });
  }

  render() {
    let pageLimit = [5, 10, 15, 20, 25, 50, 100];
    let numOfPage = Math.ceil(this.state.total / this.state.perPage);
    let max = numOfPage;
    if (numOfPage > 8) max = 8
    return (
      <div className="container-fluid">
        <div className="row">

          {/* list section start */}
          <div className="col-md-8">

            <div className="row">
              <div className="col-md-8">
              </div>
              <div className="col-md-4">
                <div className="form-group pull-right">
                  <input type="text" className="form-control" id="queryReference" name="query" onChange={this.saveState} placeholder="search" />
                </div>
              </div>
            </div>

            <table className="table table-striped table-bordered">

              <thead>
                <tr>
                  <th>
                    Name
                  </th>
                  <th>
                    Status
                  </th>
                  <th>
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {this.state.shopList.map((shop, i) =>
                  <tr>
                    <td>
                      {shop.name}
                    </td>
                    <td>
                      {shop.shopName}
                    </td>
                    <td>
                      {shop.status}
                    </td>
                  </tr>
                )}
              </tbody>

            </table>

            <div className="row">
              <div className="col-md-2">
                <select className="form-control" name="perPage" value={this.state["perPage"]} onChange={this.saveState}>
                  {pageLimit.map((p) => <option value={p}>{p}</option>)}
                </select>
              </div>
              <div className="col-md-10 text-right">
                <Pagination items={this.state.total} activePage={this.state.page} maxButtons={max} onSelect={this.pageSelect} />
              </div>
            </div>
          </div>
          {/* list section end */}

          {/* entry form start */}
          <div className="col-md-4">
            <div className="form-container">
              <form>
                <div className="form-group">
                  <label for="nameReference">Name</label>
                  <input type="text" className="form-control" id="nameReference" name="name" value={this.state["name"]} onChange={this.saveState} />
                </div>
                <div className="form-group">
                  <label for="shopNameReference">Shop Name</label>
                  <input type="text" className="form-control" id="shopNameReference" name="shopName" value={this.state["shopName"]} onChange={this.saveState} />
                </div>
                <div className="form-group">
                  <label for="statusReference">Status</label>
                  <textarea type="text" className="form-control" id="statuseference" name="status" rows="6" value={this.state["status"]} onChange={this.saveState}>
                  </textarea>
                </div>
                <button type="button" className="btn btn-success" onClick={this.saveShoppingList}>Submit</button>
              </form>
            </div>
          </div>
          {/* entry form end */}

        </div>
      </div>
    );
  }

  componentDidMount() {
    this.getShoppingList();
  }

}

export default App;
