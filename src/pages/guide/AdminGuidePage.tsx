import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, LI, OL, P, Strong, UL } from '@/components/docs/primitives'
import { GUIDE_PAGES, guidePath, getGuideNeighbors } from '@/lib/docs'

const meta = GUIDE_PAGES.find((p) => p.slug === 'admin')!

export default function AdminGuidePage() {
  return (
    <DocPage meta={meta} pathFn={guidePath} getNeighbors={getGuideNeighbors}>
      <P>
        As an administrator you have access to everything: user accounts, warehouses, the catalog, and every warehouse's
        operations. This guide covers the setup tasks only you can do.
      </P>

      <H2>Managing Users</H2>
      <P>
        User accounts are managed under <Strong>User Management</Strong>. Only admins can create, edit, and deactivate
        accounts. There are two roles: <Strong>admin</Strong> and <Strong>manager</Strong>.
      </P>
      <OL>
        <li>Open <Strong>User Management</Strong>.</li>
        <li>Click <Strong>Create User</Strong> and enter name, email, and password.</li>
        <li>Choose a role — <Strong>admin</Strong> or <Strong>manager</Strong>.</li>
        <li>Save. The account is active by default.</li>
      </OL>
      <P>
        You can deactivate an account with the status toggle. A deactivated user cannot sign in. You cannot delete or
        deactivate your own account.
      </P>

      <H2>Creating Warehouses</H2>
      <P>
        Warehouses are the physical locations where stock lives. Go to <Strong>Warehouses</Strong> and create a new one.
      </P>
      <UL>
        <LI>Give the warehouse a unique name and a location.</LI>
        <LI>Optionally add a description, manager name, and phone number.</LI>
        <LI>Optionally assign a manager — see the next section.</LI>
      </UL>
      <DocsCallout variant="note" title="Archiving">
        A warehouse can be archived when it is empty and no longer needed. It cannot be archived while it still holds
        stock, if it is inactive, or if it is the only remaining active warehouse.
      </DocsCallout>

      <H2>Assigning Managers</H2>
      <P>
        Each manager can be assigned to exactly one warehouse. This is enforced by the system, so you cannot assign a
        manager who is already assigned elsewhere.
      </P>
      <OL>
        <li>Open the warehouse you want to manage.</li>
        <li>Choose a manager from the <Strong>Manager</Strong> list — only active managers are shown.</li>
        <li>Save. To unassign, clear the manager on the warehouse.</li>
      </OL>
      <P>
        When you unassign a manager, they keep the manager role but no longer see warehouse data and cannot create
        purchase or sales orders until they are assigned again.
      </P>

      <H2>Managing Products</H2>
      <P>
        Products live under <Strong>Products</Strong> in the catalog. Each product belongs to a category, has a unique
        SKU, a selling price (<Strong>unit price</Strong>), and a purchase cost (<Strong>cost price</Strong>).
      </P>
      <OL>
        <li>Create or choose a category first.</li>
        <li>Create the product with name, SKU, prices, and optionally a preferred supplier.</li>
        <li>Set a status — <Strong>active</Strong>, <Strong>inactive</Strong>, or <Strong>discontinued</Strong>.</li>
        <li>Only active products can be used on new sales orders.</li>
      </OL>

      <H2>Managing Suppliers</H2>
      <P>
        Suppliers are the companies you buy from. They live under <Strong>Suppliers</Strong>.
      </P>
      <UL>
        <LI>Add supplier name, email, phone, and optionally a company and contact person.</LI>
        <LI>Deactivate a supplier you no longer work with instead of deleting when they have history.</LI>
        <LI>Suppliers are linked to products and purchase orders.</LI>
      </UL>

      <H2>Managing Customers</H2>
      <P>
        Customers are the people and companies you sell to. They live under <Strong>Customers</Strong>.
      </P>
      <UL>
        <LI>Add a name, and optionally an email, phone, and address.</LI>
        <LI>A customer with sales history cannot be deleted — deactivate them instead.</LI>
        <LI>Customers are selected when creating sales orders.</LI>
      </UL>

      <H2>Beyond setup</H2>
      <P>
        As an admin you can also perform every manager task in any warehouse — purchasing, receiving, selling, shipping,
        returns, transfers, adjustments, and reports. See the <Strong>Manager Guide</Strong> for those day-to-day steps.
      </P>
    </DocPage>
  )
}