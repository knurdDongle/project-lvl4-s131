// @flow

import _ from 'lodash';
import { Status } from '../models';
import getLogger from '../utilities/logger';

const logger = getLogger('Requests');

export default (router) => {
  router.get('statusesIndex', '/statuses', async (ctx) => {
    const statuses = await Status.findAll({
      where: {
        state: 'active',
      },
    });
    ctx.render('statuses/index', { statuses });
  });

  router.get('statusesNew', '/statuses/new', async (ctx) => {
    ctx.render('statuses/new', { form: {}, errors: {} });
  });

  router.post('statusesCreate', '/statuses', async (ctx) => {
    const statusData = ctx.request.body;
    try {
      await Status.create(statusData);
      ctx.flash.set('New status successfully created');
      ctx.redirect(router.url('statusesIndex'));
    } catch (err) {
      const groupedErrors = _.groupBy(err.errors, 'path');
      logger(err, ctx.request.body);
      ctx.render('statuses/new', { form: statusData, errors: groupedErrors });
    }
  });

  router.get('statusesEdit', '/statuses/:id/edit', async (ctx) => {
    try {
      const status = await Status.findById(ctx.params.id);
      ctx.render('statuses/edit', { form: status, errors: {} });
    } catch (err) {
      ctx.status = err.status;
      logger(err, ctx.request.body);
      ctx.render('errors/error', { err: err.message });
    }
  });

  router.delete('statusesDelete', '/statuses/:id', async (ctx) => {
    const status = await Status.findById(ctx.params.id);
    status.update({
      state: 'deleted',
    });
    ctx.redirect(router.url('statusesIndex'));
  });

  router.patch('statusesUpdate', '/statuses/:id', async (ctx) => {
    const form = ctx.request.body;
    const status = await Status.findById(ctx.params.id);
    try {
      await status.update(form);
      ctx.flash.set('Status updated');
      ctx.redirect(router.url('statusesIndex'));
    } catch (err) {
      logger(err, ctx.request.body);
      const groupedErrors = _.groupBy(err.errors, 'path');
      ctx.render('statuses/edit', { form: status, errors: groupedErrors });
    }
  });
};
