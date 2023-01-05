import React from 'react';

import Table from 'antd/Table';
import Alert from 'antd/Alert';
// import { Alert, Table } from 'antd';

export default () => {
  const dataSource = [{ name: '张三' }, { name: '李四' }, { name: '王五' }];
  return (
    <div>
      <Alert message={<div>我是 micro-app1 Page1</div>} />
      <br />
      <Table
        columns={[{ title: '姓名', dataIndex: 'name' }]}
        dataSource={dataSource}
        rowKey="name"
      ></Table>
    </div>
  );
};
