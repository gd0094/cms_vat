<template>
  <light-frame :src="druidMonitorUrl" />
</template>
 
<script>
import LightFrame from '@/components/LightFrame'
export default {
  name: 'Index',
  components: { LightFrame },
  data() {
    return {
      druidMonitorUrl: `http://43.139.27.107:1534/druid/`
    }
  }
}
</script>