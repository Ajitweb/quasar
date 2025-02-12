/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding startup/initialization code.
 * Use "quasar new boot <name>" and add it there.
 * One boot file per concern. Then reference the file(s) in quasar.config.js > boot:
 * boot: ['file', ...] // do not add ".js" extension to it.
 *
 * Boot files are your "main.js"
 **/

<% if (metaConf.vueDevtools !== false) { %>
import vueDevtools from '@vue/devtools'
<% } %>

import { Quasar } from 'quasar'
import <%= metaConf.needsAppMountHook === true ? 'AppComponent' : 'RootComponent' %> from 'app/<%= sourceFiles.rootComponent %>'

<% if (store) { %>
import createStore from 'app/<%= sourceFiles.store %>'
<% } %>
import createRouter from 'app/<%= sourceFiles.router %>'

<% if (ctx.mode.capacitor) { %>
  <% if (metaConf.versions.capacitor <= 2) { %>
  import { Plugins } from '@capacitor/core'
  const { SplashScreen } = Plugins
  <% } else /* Capacitor v3+ */ { %>
  import '@capacitor/core'
    <% if (metaConf.versions.capacitorPluginApp) { %>
    // importing it so it can install itself (used by Quasar UI)
    import { App as CapApp } from '@capacitor/app'
    <% } %>
    <% if (metaConf.versions.capacitorPluginSplashscreen && capacitor.hideSplashscreen !== false) { %>
    import { SplashScreen } from '@capacitor/splash-screen'
    <% } %>
  <% } %>
<% } %>

<% if (metaConf.needsAppMountHook === true) { %>
import { defineComponent, h, onMounted<%= ctx.mode.ssr && ssr.manualPostHydrationTrigger !== true ? ', getCurrentInstance' : '' %> } from 'vue'
const RootComponent = defineComponent({
  name: 'AppWrapper',
  setup (props) {
    onMounted(() => {
      <% if (ctx.mode.capacitor && metaConf.versions.capacitorPluginSplashscreen && capacitor.hideSplashscreen !== false) { %>
      SplashScreen.hide()
      <% } %>

      <% if (metaConf.vueDevtools !== false) { %>
      vueDevtools.connect('<%= metaConf.vueDevtools.host %>', <%= metaConf.vueDevtools.port %>)
      <% } %>

      <% if (ctx.mode.ssr && ssr.manualPostHydrationTrigger !== true) { %>
      const { proxy: { $q } } = getCurrentInstance()
      $q.onSSRHydrated !== void 0 && $q.onSSRHydrated()
      <% } %>
    })

    return () => h(AppComponent, props)
  }
})
<% } %>

export default async function (createAppFn, quasarUserOptions<%= ctx.mode.ssr ? ', ssrContext' : '' %>) {
  // create store and router instances
  <% if (store) { %>
  const store = typeof createStore === 'function'
    ? await createStore({<%= ctx.mode.ssr ? 'ssrContext' : '' %>})
    : createStore

  // obtain Vuex injection key in case we use TypeScript
  const { storeKey } = await import('app/<%= sourceFiles.store %>');
  <% } %>
  const router = typeof createRouter === 'function'
    ? await createRouter({<%= ctx.mode.ssr ? 'ssrContext' + (store ? ',' : '') : '' %><%= store ? 'store' : '' %>})
    : createRouter
  <% if (store) { %>
  // make router instance available in store
  store.$router = router
  <% } %>

  // Create the app instance.
  // Here we inject into it the Quasar UI, the router & possibly the store.
  const app = createAppFn(RootComponent)

  <% if (ctx.dev || ctx.debug) { %>
  app.config.devtools = true
  <% } %>

  app.use(Quasar, quasarUserOptions<%= ctx.mode.ssr ? ', ssrContext' : '' %>)

  <% if (ctx.mode.capacitor) { %>
  app.config.globalProperties.$q.capacitor = window.Capacitor
  <% } %>

  // Expose the app, the router and the store.
  // Note that we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return {
    app,
    <%= store ? 'store, storeKey,' : '' %>
    router
  }
}
