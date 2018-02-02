// @flow

import _ from 'lodash';
import { Status } from '../models';

export default (router) => {
  router.get('statuses', '/statuses', async (ctx) => {
    const statuses = await Status.findAll({
      where: {
        state: 'active',
      },
    });
    ctx.render('statuses/index', { statuses });
  });

  router.get('statusNew', '/statuses/new', async (ctx) => {
    ctx.render('statuses/new', { form: {}, errors: {} });
  });

  router.post('statusNew', '/statuses/new', async (ctx) => {
    const statusData = ctx.request.body;
    try {
      await Status.create(statusData);
      ctx.flash.set('New status successfully created');
      ctx.redirect(router.url('statuses'));
    } catch (err) {
      const groupedErrors = _.groupBy(err.errors, 'path');
      console.error({ form: statusData, errors: groupedErrors });
      ctx.render('statuses/new', { form: statusData, errors: groupedErrors });
    }
  });

  router.get('status', '/status/:id', async (ctx) => {
    try {
      const status = await Status.findById(ctx.params.id);
      ctx.render('statuses/edit', { form: status, errors: {} });
    } catch (err) {
      console.error(err.message);
      ctx.status = err.status;
      ctx.render('errors/error', { err: err.message });
    }
  });

  router.delete('status', '/status/:id', async (ctx) => {
    const status = await Status.findById(ctx.params.id);
    status.update({
      state: 'deleted',
    });
    ctx.redirect(router.url('statuses'));
  });

  router.patch('status', '/status/:id', async (ctx) => {
    const form = ctx.request.body;
    const status = await Status.findById(ctx.params.id);
    try {
      await status.update(form);
      ctx.flash.set('Status updated');
      ctx.redirect(router.url('statuses'));
    } catch (err) {
      const groupedErrors = _.groupBy(err.errors, 'path');
      console.error({ form: status, errors: groupedErrors });
      ctx.render('statuses/edit', { form: status, errors: groupedErrors });
    }
  });
};