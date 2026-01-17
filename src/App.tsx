import React, { useMemo } from 'react'
import { Layout, Typography, Row, Col, Card, Tag, Table, Space, Divider, Collapse } from 'antd'
import { RAW } from './data'
import SnehaPothiLogo from '../src/assets/SnehaPothi.png';

const { Header, Content, Footer } = Layout
const { Title, Text } = Typography

const INC = { saffron: '#FF671F', green: '#138808' }
const dayMs = 24 * 60 * 60 * 1000

const triColorHead: React.CSSProperties = {
  background: `linear-gradient(90deg, ${INC.saffron} 0% 33%, #ffffff 33% 67%, ${INC.green} 67% 100%)`,
  color: '#111',           // readable on saffron/green; black over white stripe
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8
}

function parseDMY(d: string) {
  const parts = d.trim().replace(/\s+/g, '').split('.')
  if (parts.length < 3) return null
  const [dd, mm, yyyy] = parts
  const dt = new Date(parseInt(yyyy, 10), parseInt(mm, 10) - 1, parseInt(dd, 10))
  if (Number.isNaN(dt.valueOf())) return null
  return dt
}

const SCHEDULE = RAW.map((r) => {
  const date = parseDMY(r.dateText)
  const year = date?.getFullYear()
  const suspect = r.suspect || (year !== 2025)
  const key = `${r.dateText}-${r.mandalam || 'TBD'}`
  const weekday = date?.toLocaleString('en-IN', { weekday: 'short' }) || ''
  const month = date?.toLocaleString('en-IN', { month: 'long' }) || 'Unknown'
  return { key, ...r, date, year, suspect, weekday, month }
})

function useTodayBlock() {
  const now = new Date()
  const days = [0, 1, 2].map((o) => new Date(now.getTime() + o * dayMs))
  const match = (d: Date | null | undefined, w: Date) => !!d && d.toDateString() === w.toDateString()
  const [t0, t1, t2] = days.map((d) => SCHEDULE.find((r) => match(r.date, d)))
  return { today: t0, tomorrow: t1, dayAfter: t2 }
}

export default function App() {
  const { today, tomorrow, dayAfter } = useTodayBlock()

  const columns = [
    {
      title: 'Date',
      dataIndex: 'dateText',
      key: 'date',
      render: (_: any, r: any) => r.date ? r.date.toLocaleDateString('en-IN') : r.dateText,
      sorter: (a: any, b: any) => (a.date?.getTime() || 0) - (b.date?.getTime() || 0),
      defaultSortOrder: 'ascend' as const,
    },
    { title: 'Day', dataIndex: 'weekday', key: 'weekday', width: 90 },
    { title: 'Mandalam', dataIndex: 'mandalam', key: 'mandalam' },
    {
      title: 'Flags',
      key: 'flags',
      width: 160,
      render: (_: any, r: any) => (
        <Space wrap>
          {r.tbd && <Tag> TDB </Tag>}
          {r.suspect && <Tag color="orange">Check year</Tag>}
        </Space>
      )
    }
  ]

  // Group table data by month
  const groups = useMemo(() => {
    const by: Record<string, any[]> = {}
    SCHEDULE.forEach((r) => { (by[r.month] ||= []).push(r) })
    Object.values(by).forEach((arr) => arr.sort((a, b) => (a.date?.getTime()||0) - (b.date?.getTime()||0)))
    return by
  }, [])

  const monthOrder = ['August', 'September', 'October', 'November', 'December', 'Unknown'];
  const currentMonthName = new Date().toLocaleString('en-IN', { month: 'long' });
  return (
    <Layout style={{ minHeight: '100vh', background: '#f7f9fb' }}>
      <Header style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
  <Row align="middle" justify="space-between">
    <Col>
      <Space>
      <img  src={SnehaPothiLogo}  alt="Sneha Pothi" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }}/>
        <div>
          <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
            Indian Youth Congress • Trivandrum District
          </Text>
          <Title level={4} style={{ margin: 0 }}>Sneha Pothi</Title>
        </div>
      </Space>
    </Col>
    <Col>
      <Space size="small">
        <Tag color={INC.green}>12:30 PM</Tag>
        <Tag>RCC Thiruvananthapuram</Tag>
      </Space>
    </Col>
  </Row>
</Header>


      <Content style={{ maxWidth: 1200, margin: '16px auto', width: '100%', padding: '0 16px' }}>
        {/* Dashboard hero */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card title="Today" headStyle={triColorHead} bodyStyle={{ minHeight: 120 }}>
              {today ? (
                <>
                  <Title level={3} style={{ marginTop: 0 }}>{today.mandalam || 'TBD'}</Title>
                  <Text type="secondary">{today.date?.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' })}</Text>
                  <div style={{ marginTop: 8 }}>
                    {today.suspect && <Tag color="orange">Check year</Tag>}
                    {today.tbd && <Tag> TBD </Tag>}
                  </div>
                </>
              ) : <Text type="secondary">No entry</Text>}
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card title="Tomorrow" headStyle={triColorHead} bodyStyle={{ minHeight: 120 }}>
              {tomorrow ? (
                <>
                  <Title level={3} style={{ marginTop: 0 }}>{tomorrow.mandalam || 'TBD'}</Title>
                  <Text type="secondary">{tomorrow.date?.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' })}</Text>
                  <div style={{ marginTop: 8 }}>
                    {tomorrow.suspect && <Tag color="orange">Check year</Tag>}
                    {tomorrow.tbd && <Tag> TBD </Tag>}
                  </div>
                </>
              ) : <Text type="secondary">No entry</Text>}
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card title="Day After" headStyle={triColorHead} bodyStyle={{ minHeight: 120 }}>
              {dayAfter ? (
                <>
                  <Title level={3} style={{ marginTop: 0 }}>{dayAfter.mandalam || 'TBD'}</Title>
                  <Text type="secondary">{dayAfter.date?.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' })}</Text>
                  <div style={{ marginTop: 8 }}>
                    {dayAfter.suspect && <Tag color="orange">Check year</Tag>}
                    {dayAfter.tbd && <Tag> TBD </Tag>}
                  </div>
                </>
              ) : <Text type="secondary">No entry</Text>}
            </Card>
          </Col>
        </Row>

        <Divider orientation="left">Full Schedule</Divider>


      <Collapse
      accordion
      defaultActiveKey={ monthOrder.includes(currentMonthName) ? currentMonthName : 'August' }
      items={monthOrder
        .filter((m) => groups[m])
        .map((month) => ({
          key: month,
          label: month,
          children: (
            <Table
              size="middle"
              rowKey="key"
              dataSource={groups[month]}
              columns={columns as any}
              pagination={{ pageSize: 8 }}
            />
          )
        }))}
      />

      </Content>

      <Footer style={{ textAlign: 'center' }}>
        © {new Date().getFullYear()} Indian Youth Congress – Trivandrum District Committee
      </Footer>
    </Layout>
  )
}