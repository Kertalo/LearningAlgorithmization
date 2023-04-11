class AddEndToLevels < ActiveRecord::Migration[7.0]
  def change
    remove_column :levels, :position, :integer
    add_column :levels, :start, :integer
    add_column :levels, :end, :integer
    add_column :levels, :labyrinth, :string
    add_column :levels, :blocks, :string
  end
end
