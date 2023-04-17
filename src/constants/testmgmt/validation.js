export const testScenarioValidationRules = {
  inline: true,
    on: 'blur',
    fields: {
      scenario_code: {
        identifier: 'scenario_code',
        rules: [
          {
            type: 'empty',
            prompt: '请输入场景编码'
          }
        ]
      },
      scenario_name: {
        identifier: 'scenario_name',
        rules: [
          {
            type: 'empty',
            prompt: '请输入场景名称'
          }
        ]
      },
      scenario_level: {
        identifier: 'scenario_level',
        rules: [
          {
            type: 'empty',
            prompt: '请选择优先级'
          }
        ]
      },
      scenario_type: {
        identifier: 'scenario_type',
        rules: [
          {
            type: 'empty',
            prompt: '请选择类型'
          }
        ]
      },
      project_name: {
        identifier: 'project_name',
        rules: [
          {
            type: 'empty',
            prompt: '请选择项目'
          }
        ]
      },
      module_name: {
        identifier: 'module_name',
        rules: [
          {
            type: 'empty',
            prompt: '请选择项目模块'
          }
        ]
      },
      description: {
        identifier: 'description',
        rules: [
          {
            type: 'maxLength[200]',
            prompt: '最大输入200个字符'
          }
        ]
      }
    }
}
export const testCaseValidationRules = {
    inline: true,
    // on: 'blur',
    fields: {
      api_name: {
        identifier: 'api_name',
        rules: [
          {
            type: 'empty',
            prompt: '请输入APICASE名称'
          }
        ]
      },
      method: {
        identifier: 'method',
        rules: [
          {
            type: 'empty',
            prompt: '请选择请求方法'
          }
        ]
      },
      path: {
        identifier: 'path',
        rules: [
          {
            type: 'empty',
            prompt: '请输入PATH'
          }
        ]
      },
      expected_status: {
        identifier: 'expected_status',
        rules: [
          {
            type: 'empty',
            prompt: '请输入响应码'
          }
        ]
      },
      validate_type: {
        identifier: 'validate_type',
        rules: [
          {
            type: 'empty',
            prompt: '请选择验证类型'
          }
        ]
      },
      expected_data: {
        identifier: 'expected_data',
        rules: [
          {
            type: 'empty',
            prompt: '请输入期望响应体'
          }
        ]
      },
      test_priority: {
        identifier: 'test_priority',
        rules: [
          {
            type: 'empty',
            prompt: '请输入优先级'
          }
        ]
      }
    }
}