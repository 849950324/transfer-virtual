import { computed, watch } from 'vue'
import { isFunction } from 'element-plus/es/utils/index'
import { CHECKED_CHANGE_EVENT } from '../transfer-panel'
import { usePropsAlias } from './use-props-alias'

import type { SetupContext } from 'vue'
import type { CheckboxValueType } from 'element-plus'
import type { TransferKey } from '../transfer'
import type {
  TransferPanelEmits,
  TransferPanelProps,
  TransferPanelState,
} from '../transfer-panel'

export const useCheck = (
  props: TransferPanelProps,
  panelState: TransferPanelState,
  emit: SetupContext<TransferPanelEmits>['emit']
) => {
  const propsAlias = usePropsAlias(props)

  const filteredData = computed(() => {
    return props.data.filter((item) => {
      if (isFunction(props.filterMethod)) {
        return props.filterMethod(panelState.query, item)
      } else {
        const label = String(item[propsAlias.value.label] ?? item[propsAlias.value.key]);
        return label.toLowerCase().includes(panelState.query.toLowerCase())
      }
    })
  })

  const checkableData = computed(() =>
    filteredData.value.filter((item) => !item[propsAlias.value.disabled])
  )

  const checkedSummary = computed(() => {
    const checkedLength = panelState.checked.length
    const dataLength = props.data.length
    const { noChecked, hasChecked } = props.format

    if (noChecked && hasChecked) {
      return checkedLength > 0
        ? hasChecked
            .replace(/\${checked}/g, checkedLength.toString())
            .replace(/\${total}/g, dataLength.toString())
        : noChecked.replace(/\${total}/g, dataLength.toString())
    } else {
      return `${checkedLength}/${dataLength}`
    }
  })

  const isIndeterminate = computed(() => {
    const checkedLength = panelState.checked.length
    return checkedLength > 0 && checkedLength < checkableData.value.length
  })

  const updateAllChecked = () => {
    // 检查 checkableData.value 是否为空
    if (checkableData.value.length === 0) {
      panelState.allChecked = false;
      return;
    }
  
    // 提取数据键值
    const dataKeys = checkableData.value.map(
      (dataItem) => dataItem[propsAlias.value.key] // 假设 propsAlias.value.key 是 'id' 或类似的唯一标识符
    );
  
    // 将 panelState.checked 转换为 Set 以提高查找性能
    const checkedSet = new Set(panelState.checked);
  
    // 更新 allChecked 的状态
    panelState.allChecked = dataKeys.length > 0 && dataKeys.every((dataKey) => checkedSet.has(dataKey));
  }

  const handleAllCheckedChange = (value: CheckboxValueType) => {
    panelState.checked = value
      ? checkableData.value.map((item) => item[propsAlias.value.key])
      : []
  }

  watch(
    () => panelState.checked,
    (val, oldVal) => {
      updateAllChecked()
  
      if (panelState.checkChangeByUser) {
        // 使用 Set 来存储值，以提高查找效率
        const setVal = new Set(val);
        const setOldVal = new Set(oldVal);
  
        // 计算新增加和被移除的键
        const addedKeys = Array.from(setVal).filter(v => !setOldVal.has(v));
        const removedKeys = Array.from(setOldVal).filter(v => !setVal.has(v));
        const movedKeys = [...addedKeys, ...removedKeys];
  
        emit(CHECKED_CHANGE_EVENT, val, movedKeys);
      } else {
        emit(CHECKED_CHANGE_EVENT, val);
        // 在这里设置为true，表示下一次变化是由用户引起的
        panelState.checkChangeByUser = true;
      }
    }
  )

  watch(checkableData, () => {
    updateAllChecked()
  })

  watch(
    () => props.data,
    () => {
      // 假设TransferKey为string类型
      const checked: TransferKey[] = []
      const filteredDataKeys = new Set(filteredData.value.map(
        (item) => item[propsAlias.value.key] as TransferKey // 确保类型正确
      ))
  
      panelState.checked.forEach((item) => {
        if (filteredDataKeys.has(item)) {
          checked.push(item)
        }
      })
  
      // 修改状态前的注释
      // 清除用户触发的检查变更标志，并更新已选中的项
      panelState.checkChangeByUser = false
      panelState.checked = checked
    }
  )
  
  watch(
    () => props.defaultChecked,
    (val, oldVal) => {
      // 保留原有的逻辑，即使 val 和 oldVal 完全相同也会更新 checked
      const checkableDataKeysSet = new Set(checkableData.value.map(
        (item) => item[propsAlias.value.key]
      ));
  
      // 使用 Set 的 has 方法来填充 checked 数组
      const checked: TransferKey[] = val.filter(item => checkableDataKeysSet.has(item));
  
      panelState.checkChangeByUser = false;
      panelState.checked = checked;
    },
    {
      immediate: true,
    }
  )

  return {
    filteredData,
    checkableData,
    checkedSummary,
    isIndeterminate,
    updateAllChecked,
    handleAllCheckedChange,
  }
}
