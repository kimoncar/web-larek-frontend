import { AppApi } from './components/AppApis';
import { Api } from './components/base/api';
import './scss/styles.scss';
import { IApi, IProduct } from './types';
import { API_URL, CDN_URL, settings } from './utils/constants';

const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(CDN_URL, baseApi);

api.getProducts()
  .then(function (data: IProduct[]) {
    console.log(data);
  })
  // .then(dataModel.setProductCards.bind(dataModel))
  .catch(error => console.log(error))