<?php
/**
 * Copyright (C) 2019 thirty bees
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License (AFL 3.0)
 * that is bundled with this package in the file LICENSE.md.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/afl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@thirtybees.com so we can send you a copy immediately.
 *
 * @author    thirty bees <modules@thirtybees.com>
 * @copyright 2019 thirty bees
 * @license   Academic Free License (AFL 3.0)
 */

namespace CoreUpdater;
use \Translate;

if (!defined('_TB_VERSION_')) {
    exit;
}

/**
 * Class ExtraKey
 *
 * Represents extra / unknown table key
 *
 * @since 1.1.0
 */
class ExtraKey implements SchemaDifference
{
    /**
     * @var TableSchema table
     */
    public $table;

    /**
     * @var TableKey key
     */
    public $key;

    /**
     * ExtraKey constructor.
     *
     * @param TableSchema $table
     * @param TableKey $key
     *
     * @since 1.1.0
     */
    public function __construct(TableSchema $table, TableKey $key)
    {
        $this->table = $table;
        $this->key = $key;
    }

    /**
     * Return description of the difference.
     *
     * @return string
     *
     * @since 1.1.0
     */
    function describe()
    {
        return sprintf(
            Translate::getModuleTranslation('coreupdater', 'Extra %1$s in table `%2$s`', 'coreupdater'),
            $this->key->describeKey(),
            $this->table->getName()
        );
    }
}
