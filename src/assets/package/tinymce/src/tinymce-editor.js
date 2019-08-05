/**
 * Created by skz on 2018/3/13 10:43
 */
/* eslint-disable no-undef */
import tinymceSetting from './setting'
export default {
  name: 'TinymceEditor',
  data () {
    return {
      cacheKey: 'tinymceEditorContent',
      firstInited: true,
      editor: null
    }
  },
  props: {
    id: {
      type: String,
      default: 'vue-tinymce-' + Date.now()
    },
    value: {
      type: String,
      default: ''
    },
    setup: {
      type: Function,
      default: () => {}
    },
    setting: {
      type: Object,
      default: () => tinymceSetting
    },
    gallery: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    editorContent () {
      return this.value
    }
  },
  created () {
    if (typeof window.tinymce === 'undefined') throw new Error('tinymce undefined')
  },
  mounted () {
    this.$nextTick(() => {
      this.initEditor()
    })
  },
  render (h) {
    return h('div', {
      attrs: {
        id: this.id
      }
    })
  },
  watch: {
    value (v) {
      if (this.firstInited) {
        this.firstInited = false
      }
      this.editor && this.setEditorContent(v)
    }
  },
  methods: {
    initEditor () {
      const _this = this
      const setting = Object.assign({}, this.setting, {
        selector: '#' + this.id,
        setup (editor) {
          _this.setup(editor)
          _this.editor = editor
          editor.on('init', function (e) {
            const cacheContent = _this.getCacheContent()
            if (cacheContent) {
              _this.setEditorContent(cacheContent)
              _this.broadcastEvent('input', _this.getCacheContent())
            } else {
              _this.setEditorContent(_this.editorContent)
            }
          })
          editor.on('keydown', function (e) {
            _this.setCacheContent(_this.getEditorContent())
            _this.broadcastEvent('input', _this.getEditorContent())
          })
          editor.on('NodeChange', () => {
            _this.setCacheContent(_this.getEditorContent())
            _this.broadcastEvent('input', _this.getEditorContent())
          })
        }
      })
      window.tinymce.init(setting)
    },
    setEditorContent (content) {
      try {
        this.editor.setContent(content || this.getCacheContent() || '')
      } catch (err) {}
    },
    getEditorContent () {
      return this.editor.getContent()
    },
    destroyEditor () {
      this.editor.remove()
      this.editor = null
      this.removeCacheContent()
    },
    broadcastEvent (eventType, content) {
      this.$emit(eventType, content)
    },
    setCacheContent (content) {
      localStorage.setItem(this.cacheKey, content)
    },
    getCacheContent () {
      return localStorage.getItem(this.cacheKey)
    },
    removeCacheContent () {
      localStorage.removeItem(this.cacheKey)
    }
  },
  beforeDestroy () {
    this.destroyEditor()
  }
}
