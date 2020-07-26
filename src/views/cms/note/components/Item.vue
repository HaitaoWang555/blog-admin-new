<script>
import 'file-icons-js/css/style.css'
import FileIcons from 'file-icons-js'

export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: Object,
      default: null
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []
    const iconClass = FileIcons.getClass(icon.name)
    if (iconClass) {
      vnodes.push(<i class={(iconClass + ' el-icon-fileiconsjs')}></i>)
    } else {
      vnodes.push(<i class='el-icon-folder'></i>)
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>
