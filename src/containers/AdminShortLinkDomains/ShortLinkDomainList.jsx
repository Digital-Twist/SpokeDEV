import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import DataTables from 'material-ui-datatables'
import Toggle from 'material-ui/Toggle'
import IconButton from 'material-ui/IconButton'
import CheckCircleIcon from 'material-ui/svg-icons/action/check-circle'
import BlockIcon from 'material-ui/svg-icons/content/block'
import ThumbUpIcon from 'material-ui/svg-icons/action/thumb-up'
import ThumbDownIcon from 'material-ui/svg-icons/action/thumb-down'
import DeleteForeverIcon from 'material-ui/svg-icons/action/delete-forever'
import { red500, green500 } from 'material-ui/styles/colors'

class ShortLinkDomainList extends Component {

  tableColumns = () => ([
    {
      label: 'Eligible',
      tooltip: 'Whether the domain eligible for rotation.',
      render: (value, row) => {
        const isEligible = row.isHealthy && !row.isManuallyDisabled
        return isEligible
          ? <CheckCircleIcon color={green500} />
          : <BlockIcon color={red500} />
      }
    }, {
      key: 'domain',
      label: 'Domain'
    }, {
      key: 'currentUsageCount',
      label: 'Current Usage',
      tooltip: 'How many times the domain has been used in the current rotation.'
    }, {
      key: 'maxUsageCount',
      label: 'Maximum Usage',
      tooltip: 'Maximum numbers of times the domain should be used per rotation.'
    }, {
      key: 'isManuallyDisabled',
      label: 'Manual Disable',
      tooltip: 'Whether an admin has manually disabled this domain.',
      render: (value, row) => {
        return (
          <Toggle
            toggled={value}
            disabled={row.isRowDisabled}
            onToggle={this.createHandleDisableToggle(row.id)}
          />
        )
      }
    }, {
      key: 'isHealthy',
      label: 'Health',
      tooltip: 'Health of the domain based on text delivery report summaries.',
      render: (value, row) => {
        return value
          ? <ThumbUpIcon color={green500} />
          : <ThumbDownIcon color={red500} />
      }
    }, {
      key: 'cycledOutAt',
      label: 'Last Cycled Out',
      tooltip: 'The last time this domain was cycled out of rotation.',
      render: (value, row) => moment(value).fromNow()
    }, {
      key: 'createdAt',
      label: 'Created',
      render: (value, row) => new Date(value).toLocaleString()
    }, {
      label: '',
      style: { width: '50px' },
      render: (value, row) => {
        return (
          <IconButton
            disabled={row.isRowDisabled}
            onClick={this.createHandleDeleteClick(row.id)}
          >
            <DeleteForeverIcon color={red500} />
          </IconButton>
        )
      }
    }
  ])

  createHandleDisableToggle = domainId => (event, value) => {
    // These don't appear to be doing anything to stop handleCellClick being called...
    event.stopPropagation()
    event.nativeEvent.stopImmediatePropagation()
    event.preventDefault()

    this.props.onManualDisableToggle(domainId, value)
  }

  createHandleDeleteClick = domainId => event => {
    // These don't appear to be doing anything to stop handleCellClick being called...
    event.stopPropagation()
    event.nativeEvent.stopImmediatePropagation()
    event.preventDefault()

    this.props.onDeleteDomain(domainId)
  }

  render() {
    let { domains, disabledDomainIds } = this.props
    domains = domains.map(domain => {
      const isRowDisabled = disabledDomainIds.indexOf(domain.id) > -1
      return Object.assign({}, domain, { isRowDisabled })
    })

    return (
      <DataTables
        height="auto"
        selectable={false}
        showRowHover={false}
        columns={this.tableColumns()}
        data={domains}
        showHeaderToolbar={false}
        showFooterToolbar={false}
        showCheckboxes={false}
      />
    )
  }
}

ShortLinkDomainList.defaultProps = {
  disabledDomainIds: []
}

ShortLinkDomainList.propTypes = {
  domains: PropTypes.arrayOf(PropTypes.object).isRequired,
  disabledDomainIds: PropTypes.arrayOf(PropTypes.string),
  onManualDisableToggle: PropTypes.func.isRequired,
  onDeleteDomain: PropTypes.func.isRequired
}

export default ShortLinkDomainList
