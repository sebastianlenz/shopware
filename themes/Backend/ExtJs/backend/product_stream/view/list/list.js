/**
 * Shopware 5
 * Copyright (c) shopware AG
 *
 * According to our dual licensing model, this program can be used either
 * under the terms of the GNU Affero General Public License, version 3,
 * or under a proprietary license.
 *
 * The texts of the GNU Affero General Public License with an additional
 * permission and of our proprietary license can be found at and
 * in the LICENSE file you have received along with this program.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * "Shopware" is a registered trademark of shopware AG.
 * The licensing of the program under the AGPLv3 does not imply a
 * trademark license. Therefore any rights, title and interest in
 * our trademarks remain entirely with us.
 *
 * @category   Shopware
 * @package    ProductStream
 * @subpackage Window
 * @version    $Id$
 * @author shopware AG
 */
//{namespace name=backend/product_stream/main}

Ext.define('Shopware.apps.ProductStream.view.list.List', {
    extend: 'Shopware.grid.Panel',
    alias: 'widget.product-stream-listing-grid',
    region: 'center',

    addButtonText: '{s name=add_condition_stream}Add condition stream{/s}',

    configure: function () {
        return {
            detailWindow: 'Shopware.apps.ProductStream.view.condition_list.Window',
            columns: {
                name: { header: '{s name=name}Name{/s}' },
                description: { header: '{s name=description}Description{/s}' }
            }
        };
    },

    createFeatures: function() {
        var me = this,
            features = me.callParent(arguments);

        features.push(me.createGroupingFeature());
        return features;
    },

    createGroupingFeature: function() {
        var me = this;

        return Ext.create('Ext.grid.feature.Grouping', {
            groupHeaderTpl: [
                '{literal}{name:this.formatName}{/literal}',
                {
                    formatName: function(type) {
                        if (type == 2) {
                            return '{s name=defined_streams}Defined streams{/s}';
                        } else {
                            return '{s name=condition_streams}Condition streams{/s}';
                        }
                    }
                }
            ]
        });
    },

    createToolbarItems: function () {
        var me = this, items;
        items = me.callParent(arguments);

        items = Ext.Array.insert(items, 1, [{
            xtype: 'button',
            iconCls: 'sprite-plus-circle-frame',
            text: '{s name=add_defined_stream}Add defined stream{/s}',
            handler: function () {
                var record = Ext.create('Shopware.apps.ProductStream.model.Stream');
                record.set('type', 2);
                me.fireEvent('open-defined-list-window', record);
            }
        }]);

        return items;
    },

    createEditColumn: function () {
        var me = this,
            column = me.callParent(arguments);

        column.handler = function (view, rowIndex, colIndex, item, opts, record) {
            if (record.get('type') == 2) {
                record.reload({
                    callback: function (result) {
                        me.fireEvent('open-defined-list-window', result);
                    }
                });
            } else {
                me.fireEvent(me.eventAlias + '-edit-item', me, record, rowIndex, colIndex, item, opts);
            }
        };

        return column;
    }
});