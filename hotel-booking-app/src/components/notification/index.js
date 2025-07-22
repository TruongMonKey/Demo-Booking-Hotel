import { BellOutlined } from '@ant-design/icons'
import { Dropdown, Button, Badge } from 'antd'
import './notification.scss'

function Notification() {
  const items = [
    {
      label: <div className='notify__item'>
        <span className='icon'><BellOutlined /></span>
        <span className='content'>
          <div className='title'>
            item 1
          </div>
          <div className='time'>
            8 min ago
          </div>
        </span>
      </div>,
      key: 'item-1'
    },
    {
      label: <div className='notify__item'>
        <span className='icon'><BellOutlined /></span>
        <span className='content'>
          <div className='title'>
            item 2
          </div>
          <div className='time'>
            8 min ago
          </div>
        </span>
      </div>,
      key: 'item-2'
    },
    {
      label: <div className='notify__item'>
        <span className='icon'><BellOutlined /></span>
        <span className='content'>
          <div className='title'>
            item 3
          </div>
          <div className='time'>
            8 min ago
          </div>
        </span>
      </div>,
      key: 'item-3'
    },
    {
      label: <div className='notify__item'>
        <span className='icon'><BellOutlined /></span>
        <span className='content'>
          <div className='title'>
            item 4
          </div>
          <div className='time'>
            8 min ago
          </div>
        </span>
      </div>,
      key: 'item-4'
    },
    {
      label: <div className='notify__item'>
        <span className='icon'><BellOutlined /></span>
        <span className='content'>
          <div className='title'>
            item 5
          </div>
          <div className='time'>
            8 min ago
          </div>
        </span>
      </div>,
      key: 'item-5'
    },
    {
      label: <div className='notify__item'>
        <span className='icon'><BellOutlined /></span>
        <span className='content'>
          <div className='title'>
            item 6
          </div>
          <div className='time'>
            8 min ago
          </div>
        </span>
      </div>,
      key: 'item-6'
    }
  ]

  return (
    <>
      <Dropdown menu={{ items }} trigger={'click'} placement='bottomLeft' dropdownRender={(items) => (
        <>
          <div className='notify'>
            <div className='notify__header'>
              <div className='notify__header--right'>
                <span className='notify__header--right-icon'><BellOutlined /></span>
                <span className='notify__header--right-title'>Notification</span>
              </div>
              <div className='notify__header--left'>
                <a href='/'>View All</a>
              </div>
            </div>
            <div className='notify__body'>
              {items}
            </div>
          </div>
        </>
      )}>
        <Badge dot={true}>
          <Button className='button-notify'><BellOutlined /></Button>
        </Badge>
      </Dropdown>
    </>
  )
}

export default Notification;