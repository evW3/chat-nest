import { createStore } from 'vuex';
import admin from "./admin";

export const store = createStore({ modules: { admin } });