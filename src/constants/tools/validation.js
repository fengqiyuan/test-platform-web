
export const mockDataValidationRules = {
        inline: true,
        on: 'blur',
        fields: {
          mock_name: {
            identifier: 'mock_name',
            rules: [
              {
                type: 'empty',
                prompt: '请输入测试Mock名称'
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
          env_name: {
            identifier: 'env_name',
            rules: [
              {
                type: 'empty',
                prompt: '请选择项目模块'
              }
            ]
          },
          url: {
            identifier: 'url',
            rules: [
              {
                type: 'empty',
                prompt: '请输入URL'
              },
              {
                type: 'url',
                prompt: '请输入URL'
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
          response_data: {
            identifier: 'response_data',
            rules: [
              {
                type: 'empty',
                prompt: '请输入response_data'
              }
            ]
          }
        }
}
